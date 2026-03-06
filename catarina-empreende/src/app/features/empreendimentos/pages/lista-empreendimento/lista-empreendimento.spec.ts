import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

import { ListaEmpreendimento } from './lista-empreendimento';
import { EmpreendimentoService } from '../../services/empreendimento.service';
import { Empreendimento, SegmentoAtuacao } from '../../model/empreendimento.model';

// ── helpers ──────────────────────────────────────────────────────────────────

function criarEmpreendimentoMock(parcial: Partial<Empreendimento> = {}): Empreendimento {
  return {
    id: 'mock-id-001',
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
    dataCriacao: 1700000000000,
    ...parcial,
  };
}

// ── spy factory ──────────────────────────────────────────────────────────────

function criarSpyServico(empreendimentos: Empreendimento[] = []) {
  const spy = jasmine.createSpyObj<EmpreendimentoService>('EmpreendimentoService', [
    'observarTodos',
    'buscarTodos',
    'criar',
    'atualizar',
    'excluir',
    'buscarPorId',
  ]);
  spy.observarTodos.and.returnValue(of(empreendimentos));
  spy.buscarTodos.and.returnValue(Promise.resolve(empreendimentos));
  spy.criar.and.returnValue(Promise.resolve('novo-id'));
  spy.excluir.and.returnValue(Promise.resolve());
  return spy;
}

// ── suite ─────────────────────────────────────────────────────────────────────

describe('ListaEmpreendimento', () => {
  let component: ListaEmpreendimento;
  let fixture: ComponentFixture<ListaEmpreendimento>;
  let servicoSpy: jasmine.SpyObj<EmpreendimentoService>;
  let confirmacaoService: ConfirmationService;

  async function configurarTestBed(empreendimentos: Empreendimento[] = []) {
    servicoSpy = criarSpyServico(empreendimentos);

    await TestBed.configureTestingModule({
      imports: [ListaEmpreendimento, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EmpreendimentoService, useValue: servicoSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEmpreendimento);
    component = fixture.componentInstance;

    // Pega o ConfirmationService provido DIRETAMENTE pelo componente
    confirmacaoService = fixture.debugElement.injector.get(ConfirmationService);
    spyOn(confirmacaoService, 'confirm');

    fixture.detectChanges();
    await fixture.whenStable();
  }

  // ── criação do componente ────────────────────────────────────────────────────

  describe('criação', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve iniciar com dialogFormularioVisivel = false', () => {
      expect(component.dialogFormularioVisivel).toBeFalse();
    });

    it('deve iniciar com empreendimentoEmEdicao = null', () => {
      expect(component.empreendimentoEmEdicao).toBeNull();
    });

    it('deve iniciar com dialogImagensVisivel = false', () => {
      expect(component.dialogImagensVisivel).toBeFalse();
    });

    it('deve chamar observarTodos ao ser inicializado', () => {
      expect(servicoSpy.observarTodos).toHaveBeenCalled();
    });
  });

  // ── listaEmpreendimentos signal ──────────────────────────────────────────────

  describe('listaEmpreendimentos', () => {
    it('deve emitir a lista recebida do serviço', async () => {
      const mocks = [criarEmpreendimentoMock(), criarEmpreendimentoMock({ id: 'id-002' })];
      await configurarTestBed(mocks);
      expect(component.listaEmpreendimentos().length).toBe(2);
    });

    it('deve iniciar com lista vazia quando o serviço retorna []', async () => {
      await configurarTestBed([]);
      expect(component.listaEmpreendimentos()).toEqual([]);
    });
  });

  // ── abrirFormularioCriacao ───────────────────────────────────────────────────

  describe('abrirFormularioCriacao()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve abrir o dialog de formulário', () => {
      component.abrirFormularioCriacao();
      expect(component.dialogFormularioVisivel).toBeTrue();
    });

    it('deve limpar o empreendimento em edição', () => {
      component.empreendimentoEmEdicao = criarEmpreendimentoMock();
      component.abrirFormularioCriacao();
      expect(component.empreendimentoEmEdicao).toBeNull();
    });
  });

  // ── abrirFormularioEdicao ────────────────────────────────────────────────────

  describe('abrirFormularioEdicao()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve abrir o dialog de formulário', () => {
      component.abrirFormularioEdicao(criarEmpreendimentoMock());
      expect(component.dialogFormularioVisivel).toBeTrue();
    });

    it('deve definir o empreendimento em edição corretamente', () => {
      const mock = criarEmpreendimentoMock({ id: 'id-edicao' });
      component.abrirFormularioEdicao(mock);
      expect(component.empreendimentoEmEdicao).toEqual(mock);
    });
  });

  // ── aoSalvarFormulario ───────────────────────────────────────────────────────

  describe('aoSalvarFormulario()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve fechar o dialog de formulário', () => {
      component.dialogFormularioVisivel = true;
      component.aoSalvarFormulario();
      expect(component.dialogFormularioVisivel).toBeFalse();
    });
  });

  // ── aoFecharDialogFormulario ─────────────────────────────────────────────────

  describe('aoFecharDialogFormulario()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve limpar o empreendimento em edição', () => {
      component.empreendimentoEmEdicao = criarEmpreendimentoMock();
      component.aoFecharDialogFormulario();
      expect(component.empreendimentoEmEdicao).toBeNull();
    });
  });

  // ── abrirImagens ─────────────────────────────────────────────────────────────

  describe('abrirImagens()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve abrir o dialog de imagens', () => {
      component.abrirImagens(criarEmpreendimentoMock());
      expect(component.dialogImagensVisivel).toBeTrue();
    });

    it('deve definir o empreendimento em foco', () => {
      const mock = criarEmpreendimentoMock({ id: 'id-imagens' });
      component.abrirImagens(mock);
      expect(component.empreendimentoEmFoco).toEqual(mock);
    });
  });

  // ── abrirMapa ────────────────────────────────────────────────────────────────

  describe('abrirMapa()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve chamar window.open com URL do Google Maps', () => {
      spyOn(window, 'open');
      component.abrirMapa(criarEmpreendimentoMock());
      expect(window.open).toHaveBeenCalledWith(
        jasmine.stringMatching(/google\.com\/maps/),
        '_blank'
      );
    });

    it('deve chamar alert quando logradouro e cidade estiverem em branco', () => {
      spyOn(window, 'alert');
      const mock = criarEmpreendimentoMock({
        municipio: '',
        endereco: { logradouro: '', bairro: '', cep: '' },
      });
      component.abrirMapa(mock);
      expect(window.alert).toHaveBeenCalled();
    });

    it('NÃO deve chamar window.open quando endereço está vazio', () => {
      spyOn(window, 'open');
      spyOn(window, 'alert');
      const mock = criarEmpreendimentoMock({
        municipio: '',
        endereco: { logradouro: '', bairro: '', cep: '' },
      });
      component.abrirMapa(mock);
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  // ── excluirEmpreendimento ────────────────────────────────────────────────────

  describe('excluirEmpreendimento()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve chamar ConfirmationService.confirm', () => {
      component.excluirEmpreendimento(criarEmpreendimentoMock());
      expect(confirmacaoService.confirm).toHaveBeenCalled();
    });

    it('deve chamar excluir no serviço ao confirmar a exclusão', async () => {
      const mock = criarEmpreendimentoMock({ id: 'id-excluir' });

      // Intercepta o confirm e executa o callback accept imediatamente
      (confirmacaoService.confirm as jasmine.Spy).and.callFake((config: any) => config.accept?.());

      component.excluirEmpreendimento(mock);
      // aguarda a promise interna do accept
      await fixture.whenStable();

      expect(servicoSpy.excluir).toHaveBeenCalledWith('id-excluir');
    });

    it('NÃO deve chamar excluir quando id é indefinido', async () => {
      const mock = criarEmpreendimentoMock({ id: undefined });
      (confirmacaoService.confirm as jasmine.Spy).and.callFake((config: any) => config.accept?.());

      component.excluirEmpreendimento(mock);
      await fixture.whenStable();

      expect(servicoSpy.excluir).not.toHaveBeenCalled();
    });
  });

  // ── formatarData ─────────────────────────────────────────────────────────────

  describe('formatarData()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve retornar uma string formatada em pt-BR (dd/MM/yyyy)', () => {
      const timestamp = new Date('2024-01-15T12:00:00Z').getTime();
      const resultado = component.formatarData(timestamp);
      expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve incluir horário na string formatada', () => {
      const timestamp = new Date('2024-06-20T15:30:00Z').getTime();
      const resultado = component.formatarData(timestamp);
      expect(resultado).toMatch(/\d{2}:\d{2}/);
    });
  });

  // ── obterSeveridade ───────────────────────────────────────────────────────────

  describe('obterSeveridade()', () => {
    beforeEach(async () => await configurarTestBed());

    const casos: { segmento: SegmentoAtuacao; esperado: string }[] = [
      { segmento: 'Tecnologia', esperado: 'info' },
      { segmento: 'Comércio', esperado: 'success' },
      { segmento: 'Serviços', esperado: 'secondary' },
      { segmento: 'Indústria', esperado: 'warn' },
      { segmento: 'Agronegócio', esperado: 'contrast' },
      { segmento: 'Serviço Público', esperado: 'danger' },
    ];

    casos.forEach(({ segmento, esperado }) => {
      it(`deve retornar "${esperado}" para o segmento "${segmento}"`, () => {
        expect(component.obterSeveridade(segmento)).toBe(esperado as any);
      });
    });
  });

  // ── obterRotuloStatus ─────────────────────────────────────────────────────────

  describe('obterRotuloStatus()', () => {
    beforeEach(async () => await configurarTestBed());

    it('deve retornar "Ativo" para status ativo', () => {
      expect(component.obterRotuloStatus('ativo')).toBe('Ativo');
    });

    it('deve retornar "Inativo" para status inativo', () => {
      expect(component.obterRotuloStatus('inativo')).toBe('Inativo');
    });
  });
});
