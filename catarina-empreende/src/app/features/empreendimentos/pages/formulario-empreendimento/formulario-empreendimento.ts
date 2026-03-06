import { Component, Input, Output, EventEmitter, OnInit, OnChanges, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { Empreendimento, SegmentoAtuacao, StatusEmpreendimento } from '../../model/empreendimento.model';
import { EmpreendimentoService } from '../../services/empreendimento.service';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-formulario-empreendimento',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    SelectButtonModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    InputMaskModule
  ],
  template: `
    <form [formGroup]="formulario" (ngSubmit)="salvar()" novalidate>

      <!-- SEÇÃO: Dados Principais -->
      <p-divider align="left">
        <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-color-secondary);">Dados do Empreendimento</span>
      </p-divider>

      <div class="campo-grupo">
        <label class="campo-label" for="nomeEmpreendimento">Nome do Empreendimento <span class="obrigatorio">*</span></label>
        <input
          pInputText
          id="nomeEmpreendimento"
          formControlName="nomeEmpreendimento"
          placeholder="Ex: Tech Hub Floripa"
          [class.ng-invalid]="campoInvalido('nomeEmpreendimento')"
        />
        @if (campoInvalido('nomeEmpreendimento')) {
          <small class="erro-mensagem">Nome do empreendimento é obrigatório.</small>
        }
      </div>

      <div class="campo-grupo">
        <label class="campo-label" for="nomeEmpreendedor">Nome do Empreendedor <span class="obrigatorio">*</span></label>
        <input
          pInputText
          id="nomeEmpreendedor"
          formControlName="nomeEmpreendedor"
          placeholder="Ex: Carlos Cunha"
          [class.ng-invalid]="campoInvalido('nomeEmpreendedor')"
        />
        @if (campoInvalido('nomeEmpreendedor')) {
          <small class="erro-mensagem">Nome do empreendedor é obrigatório.</small>
        }
      </div>

      <div class="campo-grupo">
        <label class="campo-label" for="descricao">Descrição <span class="obrigatorio">*</span></label>
        <textarea
          pTextarea
          id="descricao"
          formControlName="descricao"
          placeholder="Descreva brevemente as atividades do empreendimento..."
          rows="3"
          style="width: 100%; resize: vertical;"
          [class.ng-invalid]="campoInvalido('descricao')"
        ></textarea>
        @if (campoInvalido('descricao')) {
          <small class="erro-mensagem">Descrição é obrigatória.</small>
        }
      </div>

      <div class="campo-linha-dupla">
        <div class="campo-grupo">
          <label class="campo-label" for="segmentoAtuacao">Segmento <span class="obrigatorio">*</span></label>
          <p-select
            id="segmentoAtuacao"
            formControlName="segmentoAtuacao"
            [options]="opcoesSegmento"
            placeholder="Selecione o segmento"
            styleClass="w-full"
            [class.ng-invalid]="campoInvalido('segmentoAtuacao')"
          />
          @if (campoInvalido('segmentoAtuacao')) {
            <small class="erro-mensagem">Segmento é obrigatório.</small>
          }
        </div>

        <div class="campo-grupo">
          <label class="campo-label">Status <span class="obrigatorio">*</span></label>
          <p-selectbutton
            formControlName="status"
            [options]="opcoesStatus"
            optionLabel="rotulo"
            optionValue="valor"
          />
        </div>
      </div>

      <!-- SEÇÃO: Contato -->
      <p-divider align="left">
        <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-color-secondary);">Contato</span>
      </p-divider>

      <div class="campo-linha-dupla">
        <div class="campo-grupo">
          <label class="campo-label" for="contato">E-mail</label>
          <input
            pInputText
            id="contato"
            formControlName="contato"
            placeholder="contato@empresa.com.br"
            type="email"
            [class.ng-invalid]="campoInvalido('contato')"
          />
          @if (campoInvalido('contato')) {
            <small class="erro-mensagem">Informe um e-mail válido.</small>
          }
        </div>

        <div class="campo-grupo">
          <label class="campo-label" for="whatsapp">WhatsApp</label>
          <p-inputmask
            id="whatsapp"
            formControlName="whatsapp"
            mask="(99) 99999-9999"
            placeholder="(48) 99999-9999"
            styleClass="w-full"
          />
        </div>
      </div>

      <!-- SEÇÃO: Localização -->
      <p-divider align="left">
        <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-color-secondary);">Localização</span>
      </p-divider>

      <div class="campo-linha-dupla">
        <div class="campo-grupo">
          <label class="campo-label" for="municipio">Município</label>
          <input
            pInputText
            id="municipio"
            formControlName="municipio"
            placeholder="Ex: Florianópolis"
          />
        </div>

        <div class="campo-grupo">
          <label class="campo-label" for="cep">CEP</label>
          <p-inputmask
            id="cep"
            formControlName="cep"
            mask="99999-999"
            placeholder="88000-000"
            styleClass="w-full"
          />
        </div>
      </div>

      <div class="campo-grupo">
        <label class="campo-label" for="logradouro">Logradouro</label>
        <input
          pInputText
          id="logradouro"
          formControlName="logradouro"
          placeholder="Ex: Rua XV de Novembro, 123"
        />
      </div>

      <div class="campo-grupo">
        <label class="campo-label" for="bairro">Bairro</label>
        <input
          pInputText
          id="bairro"
          formControlName="bairro"
          placeholder="Ex: Centro"
        />
      </div>

      <!-- RODAPÉ: Ações -->
      <div class="formulario-acoes">
        <p-button
          label="Cancelar"
          severity="secondary"
          [outlined]="true"
          icon="pi pi-times"
          type="button"
          (onClick)="cancelar()"
        />
        <p-button
          [label]="modoEdicao ? 'Salvar Alterações' : 'Cadastrar'"
          icon="pi pi-check"
          type="submit"
          [loading]="salvando()"
          [disabled]="formulario.invalid || salvando()"
        />
      </div>

    </form>
  `,
  styles: `
    :host {
      display: block;
      padding: 0 0.5rem;
    }

    .campo-grupo {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }

    .campo-linha-dupla {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .campo-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .obrigatorio {
      color: var(--red-500, #ef4444);
    }

    .erro-mensagem {
      color: var(--red-500, #ef4444);
      font-size: 0.78rem;
    }

    .formulario-acoes {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
      margin-top: 0.5rem;
      border-top: 1px solid var(--surface-border);
    }

    input.ng-invalid.ng-touched,
    textarea.ng-invalid.ng-touched {
      border-color: var(--red-500, #ef4444);
    }

    p-select.ng-invalid {
      outline: 1px solid var(--red-500, #ef4444);
      border-radius: 6px;
    }
  `
})
export class FormularioEmpreendimento implements OnInit, OnChanges {

  /** Empreendimento recebido para edição. Se null, o formulário opera em modo criação. */
  @Input() empreendimentoParaEditar: Empreendimento | null = null;

  /** Emitido quando o formulário é salvo com sucesso. */
  @Output() formularioSalvo = new EventEmitter<void>();

  /** Emitido quando o usuário cancela a operação. */
  @Output() formularioCancelado = new EventEmitter<void>();

  private readonly construtorForm = inject(FormBuilder);
  private readonly servicoEmpreendimento = inject(EmpreendimentoService);
  private readonly detectorMudancas = inject(ChangeDetectorRef);

  /**
   * Validator customizado: valida e-mail apenas quando o campo possui valor.
   * Necessário pois `Validators.email` rejeita string vazia em campos opcionais.
   */
  private validarEmailOpcional(controle: AbstractControl): ValidationErrors | null {
    const valor = controle.value;
    if (!valor || valor.trim() === '') return null;
    return Validators.email(controle);
  }

  /** Indica se o formulário está no modo edição */
  get modoEdicao(): boolean {
    return this.empreendimentoParaEditar !== null;
  }

  /** Signal que controla o estado de carregamento ao salvar */
  salvando = signal(false);

  /** Opções do dropdown de segmento de atuação */
  readonly opcoesSegmento: SegmentoAtuacao[] = [
    'Tecnologia', 'Comércio', 'Indústria', 'Serviços', 'Serviço Público', 'Agronegócio'
  ];

  /** Opções do SelectButton de status */
  readonly opcoesStatus = [
    { rotulo: 'Ativo', valor: 'ativo' },
    { rotulo: 'Inativo', valor: 'inativo' }
  ];

  formulario!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnChanges(): void {
    if (this.formulario) {
      this.preencherFormulario();
    }
  }

  /** Inicializa o FormGroup com validações */
  private inicializarFormulario(): void {
    this.formulario = this.construtorForm.group({
      nomeEmpreendimento: ['', Validators.required],
      nomeEmpreendedor: ['', Validators.required],
      descricao: ['', Validators.required],
      segmentoAtuacao: ['', Validators.required],
      status: ['ativo' as StatusEmpreendimento],
      contato: ['', this.validarEmailOpcional.bind(this)],
      whatsapp: [''],
      municipio: [''],
      logradouro: [''],
      bairro: [''],
      cep: [''],
    });
    this.preencherFormulario();
  }

  /** Preenche o formulário com os dados do empreendimento em edição */
  private preencherFormulario(): void {
    const emp = this.empreendimentoParaEditar;
    if (emp) {
      this.formulario.patchValue({
        nomeEmpreendimento: emp.nomeEmpreendimento,
        nomeEmpreendedor: emp.nomeEmpreendedor,
        descricao: emp.descricao,
        segmentoAtuacao: emp.segmentoAtuacao,
        status: emp.status,
        contato: emp.contato,
        whatsapp: emp.whatsapp,
        municipio: emp.municipio,
        logradouro: emp.endereco?.logradouro || '',
        bairro: emp.endereco?.bairro || '',
        cep: emp.endereco?.cep || '',
      });
    } else {
      this.formulario?.reset({ status: 'ativo' });
    }
  }

  /** Verifica se o campo é inválido e foi tocado pelo usuário */
  campoInvalido(nomeCampo: string): boolean {
    const controle = this.formulario.get(nomeCampo);
    return !!(controle?.invalid && controle?.touched);
  }

  /** Persiste o empreendimento no Firebase (criação ou atualização) */
  async salvar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    const valores = this.formulario.value;

    const empreendimento: Empreendimento = {
      nomeEmpreendimento: valores.nomeEmpreendimento,
      nomeEmpreendedor: valores.nomeEmpreendedor,
      descricao: valores.descricao,
      segmentoAtuacao: valores.segmentoAtuacao,
      status: valores.status,
      contato: valores.contato,
      whatsapp: valores.whatsapp,
      municipio: valores.municipio,
      imagens: this.empreendimentoParaEditar?.imagens || [],
      endereco: {
        logradouro: valores.logradouro,
        bairro: valores.bairro,
        cep: valores.cep,
      },
      geolocalizacao: this.empreendimentoParaEditar?.geolocalizacao || {
        latitude: 0,
        longitude: 0
      }
    };

    try {
      if (this.modoEdicao && this.empreendimentoParaEditar?.id) {
        await this.servicoEmpreendimento.atualizar(this.empreendimentoParaEditar.id, empreendimento);
      } else {
        await this.servicoEmpreendimento.criar(empreendimento);
      }
      this.formularioSalvo.emit();
      this.formulario.reset({ status: 'ativo' });
      this.detectorMudancas.markForCheck();
    } catch (erro) {
      console.error('Erro ao salvar empreendimento:', erro);
    } finally {
      this.salvando.set(false);
      this.detectorMudancas.markForCheck();
    }
  }

  /** Emite o evento de cancelamento sem salvar */
  cancelar(): void {
    this.formularioCancelado.emit();
  }
}
