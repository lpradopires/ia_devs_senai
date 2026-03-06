import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectorRef, provideZonelessChangeDetection } from '@angular/core';

import { FormularioEmpreendimento } from './formulario-empreendimento';
import { EmpreendimentoService } from '../../services/empreendimento.service';
import { Empreendimento } from '../../model/empreendimento.model';

// ── helpers ──────────────────────────────────────────────────────────────────

const criarEmpreendimentoMock = (parcial: Partial<Empreendimento> = {}): Empreendimento => ({
  id: 'mock-id-123',
  nomeEmpreendimento: 'Tech Hub Floripa',
  nomeEmpreendedor: 'Carlos Cunha',
  descricao: 'Aceleradora de startups',
  segmentoAtuacao: 'Tecnologia',
  status: 'ativo',
  contato: 'carlos@techhub.com',
  whatsapp: '(48) 99999-9999',
  municipio: 'Florianópolis',
  imagens: [],
  endereco: { logradouro: 'Rua XV de Novembro', bairro: 'Centro', cep: '88000-000' },
  geolocalizacao: { latitude: -27.59, longitude: -48.54 },
  ...parcial,
});

// ── spy factory ──────────────────────────────────────────────────────────────

function criarSpyServico() {
  return jasmine.createSpyObj<EmpreendimentoService>('EmpreendimentoService', [
    'criar',
    'atualizar',
    'excluir',
    'buscarPorId',
    'buscarTodos',
    'observarTodos',
  ]);
}

// ── suite ─────────────────────────────────────────────────────────────────────

describe('FormularioEmpreendimento', () => {
  let component: FormularioEmpreendimento;
  let fixture: ComponentFixture<FormularioEmpreendimento>;
  let servicoSpy: jasmine.SpyObj<EmpreendimentoService>;

  beforeEach(async () => {
    servicoSpy = criarSpyServico();
    servicoSpy.criar.and.returnValue(Promise.resolve('novo-id'));
    servicoSpy.atualizar.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [FormularioEmpreendimento, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EmpreendimentoService, useValue: servicoSpy },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioEmpreendimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  // ── criação do componente ────────────────────────────────────────────────────

  describe('criação', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com valores padrão', () => {
      expect(component.formulario).toBeDefined();
      expect(component.formulario.get('status')?.value).toBe('ativo');
    });

    it('deve iniciar com salvando = false', () => {
      expect(component.salvando()).toBeFalse();
    });

    it('deve iniciar com modoEdicao = false quando nenhum empreendimento for fornecido', () => {
      expect(component.modoEdicao).toBeFalse();
    });
  });

  // ── modo edição ──────────────────────────────────────────────────────────────

  describe('modoEdicao', () => {
    it('deve ser true quando empreendimentoParaEditar for fornecido', () => {
      component.empreendimentoParaEditar = criarEmpreendimentoMock();
      expect(component.modoEdicao).toBeTrue();
    });

    it('deve ser false quando empreendimentoParaEditar for null', () => {
      component.empreendimentoParaEditar = null;
      expect(component.modoEdicao).toBeFalse();
    });
  });

  // ── opções estáticas ─────────────────────────────────────────────────────────

  describe('opções de formulário', () => {
    it('deve conter 6 segmentos de atuação', () => {
      expect(component.opcoesSegmento.length).toBe(6);
    });

    it('deve conter os segmentos corretos', () => {
      expect(component.opcoesSegmento).toContain('Tecnologia');
      expect(component.opcoesSegmento).toContain('Agronegócio');
    });

    it('deve conter opções de status ativo e inativo', () => {
      const valores = component.opcoesStatus.map((o) => o.valor);
      expect(valores).toContain('ativo');
      expect(valores).toContain('inativo');
    });
  });

  // ── validação de campos ──────────────────────────────────────────────────────

  describe('campoInvalido()', () => {
    it('deve retornar false para campo válido e intocado', () => {
      expect(component.campoInvalido('nomeEmpreendimento')).toBeFalse();
    });

    it('deve retornar true para campo obrigatório vazio após toque', () => {
      const controle = component.formulario.get('nomeEmpreendimento')!;
      controle.markAsTouched();
      controle.setValue('');
      expect(component.campoInvalido('nomeEmpreendimento')).toBeTrue();
    });

    it('deve retornar false quando campo obrigatório está preenchido e tocado', () => {
      const controle = component.formulario.get('nomeEmpreendimento')!;
      controle.markAsTouched();
      controle.setValue('Nome válido');
      expect(component.campoInvalido('nomeEmpreendimento')).toBeFalse();
    });

    it('deve retornar true para e-mail inválido após toque', () => {
      const controle = component.formulario.get('contato')!;
      controle.markAsTouched();
      controle.setValue('email-invalido');
      expect(component.campoInvalido('contato')).toBeTrue();
    });

    it('deve retornar false para e-mail vazio (campo opcional)', () => {
      const controle = component.formulario.get('contato')!;
      controle.markAsTouched();
      controle.setValue('');
      expect(component.campoInvalido('contato')).toBeFalse();
    });

    it('deve retornar false para e-mail válido', () => {
      const controle = component.formulario.get('contato')!;
      controle.markAsTouched();
      controle.setValue('valido@empresa.com');
      expect(component.campoInvalido('contato')).toBeFalse();
    });
  });

  // ── salvar em modo criação ───────────────────────────────────────────────────

  describe('salvar() — modo criação', () => {
    it('deve chamar markAllAsTouched e NÃO chamar criar quando formulário inválido', async () => {
      spyOn(component.formulario, 'markAllAsTouched');
      // formulário inválido: campos obrigatórios vazios
      await component.salvar();
      expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
      expect(servicoSpy.criar).not.toHaveBeenCalled();
    });

    it('deve chamar criar quando formulário válido', async () => {
      preencherFormularioValido();
      await component.salvar();
      expect(servicoSpy.criar).toHaveBeenCalled();
    });

    it('deve emitir formularioSalvo após criação bem-sucedida', async () => {
      const emitSpy = spyOn(component.formularioSalvo, 'emit');
      preencherFormularioValido();
      await component.salvar();
      expect(emitSpy).toHaveBeenCalled();
    });

    it('deve resetar para status ativo após criação bem-sucedida', async () => {
      preencherFormularioValido();
      await component.salvar();
      expect(component.formulario.get('status')?.value).toBe('ativo');
    });

    it('deve definir salvando como false mesmo se criar lançar erro', async () => {
      spyOn(console, 'error'); // evita que o Karma interprete o console.error do catch como falha do teste
      servicoSpy.criar.and.returnValue(Promise.reject(new Error('Erro de rede')));
      preencherFormularioValido();
      await component.salvar();
      expect(component.salvando()).toBeFalse();
    });
  });

  // ── salvar em modo edição ────────────────────────────────────────────────────

  describe('salvar() — modo edição', () => {
    beforeEach(() => {
      component.empreendimentoParaEditar = criarEmpreendimentoMock({ id: 'id-para-editar' });
      component.ngOnChanges();
    });

    it('deve chamar atualizar com o ID correto', async () => {
      preencherFormularioValido();
      await component.salvar();
      expect(servicoSpy.atualizar).toHaveBeenCalledWith('id-para-editar', jasmine.any(Object));
    });

    it('deve NÃO chamar criar no modo edição', async () => {
      preencherFormularioValido();
      await component.salvar();
      expect(servicoSpy.criar).not.toHaveBeenCalled();
    });

    it('deve emitir formularioSalvo após edição bem-sucedida', async () => {
      const emitSpy = spyOn(component.formularioSalvo, 'emit');
      preencherFormularioValido();
      await component.salvar();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  // ── cancelar ─────────────────────────────────────────────────────────────────

  describe('cancelar()', () => {
    it('deve emitir o evento formularioCancelado', () => {
      const emitSpy = spyOn(component.formularioCancelado, 'emit');
      component.cancelar();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  // ── ngOnChanges ──────────────────────────────────────────────────────────────

  describe('ngOnChanges()', () => {
    it('deve preencher o formulário com os dados do empreendimento em edição', () => {
      const mock = criarEmpreendimentoMock();
      component.empreendimentoParaEditar = mock;
      component.ngOnChanges();

      expect(component.formulario.get('nomeEmpreendimento')?.value).toBe(mock.nomeEmpreendimento);
      expect(component.formulario.get('nomeEmpreendedor')?.value).toBe(mock.nomeEmpreendedor);
      expect(component.formulario.get('descricao')?.value).toBe(mock.descricao);
      expect(component.formulario.get('segmentoAtuacao')?.value).toBe(mock.segmentoAtuacao);
      expect(component.formulario.get('status')?.value).toBe(mock.status);
      expect(component.formulario.get('contato')?.value).toBe(mock.contato);
      expect(component.formulario.get('municipio')?.value).toBe(mock.municipio);
      expect(component.formulario.get('logradouro')?.value).toBe(mock.endereco.logradouro);
      expect(component.formulario.get('bairro')?.value).toBe(mock.endereco.bairro);
      expect(component.formulario.get('cep')?.value).toBe(mock.endereco.cep);
    });

    it('deve resetar o formulário quando empreendimentoParaEditar for null', () => {
      // primeiro preenche
      component.empreendimentoParaEditar = criarEmpreendimentoMock();
      component.ngOnChanges();
      // depois limpa
      component.empreendimentoParaEditar = null;
      component.ngOnChanges();

      expect(component.formulario.get('nomeEmpreendimento')?.value).toBeFalsy();
      expect(component.formulario.get('status')?.value).toBe('ativo');
    });
  });

  // ── helper interno ───────────────────────────────────────────────────────────

  function preencherFormularioValido() {
    component.formulario.patchValue({
      nomeEmpreendimento: 'Empresa Teste',
      nomeEmpreendedor: 'João Teste',
      descricao: 'Descrição válida',
      segmentoAtuacao: 'Tecnologia',
      status: 'ativo',
      contato: '',
      whatsapp: '',
      municipio: 'Florianópolis',
      logradouro: 'Rua Teste',
      bairro: 'Centro',
      cep: '',
    });
  }
});
