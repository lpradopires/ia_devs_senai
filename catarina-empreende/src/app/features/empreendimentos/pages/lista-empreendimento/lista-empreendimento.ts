import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { EmpreendimentoService } from '../../services/empreendimento.service';
import { Empreendimento, SegmentoAtuacao, StatusEmpreendimento } from '../../model/empreendimento.model';
import { FormularioEmpreendimento } from '../formulario-empreendimento/formulario-empreendimento';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-lista-empreendimento',
  imports: [
    CommonModule,
    TableModule, ButtonModule, DialogModule, ImageModule, TagModule,
    InputTextModule, IconFieldModule, InputIconModule, TooltipModule,
    ConfirmDialogModule,
    FormularioEmpreendimento
  ],
  providers: [ConfirmationService],
  template: `
    <p-confirmdialog />

    <div class="card" style="width: 100%; padding: 0 1.9rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem;">Empreendimentos Catarinenses</h3>

        <p-table
            #dt
            [value]="listaEmpreendimentos()"
            [paginator]="true"
            [rows]="10"
            [scrollable]="true"
            [stripedRows]="true"
            scrollHeight="calc(100vh - 280px)"
            [tableStyle]="{ 'min-width': '120rem' }"
            styleClass="p-datatable-striped p-datatable-sm p-datatable-gridlines"
            [globalFilterFields]="['nomeEmpreendimento', 'descricao', 'nomeEmpreendedor', 'contato', 'whatsapp', 'segmentoAtuacao', 'municipio', 'status', 'endereco.logradouro']"
        >
            <ng-template #caption>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                    <p-iconfield iconPosition="left">
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            (input)="dt.filterGlobal($any($event.target).value, 'contains')"
                            placeholder="Buscar Empreendimento..."
                            style="width: 20rem;"
                        />
                    </p-iconfield>

                    <p-button
                        label="Novo Empreendimento"
                        icon="pi pi-plus"
                        severity="success"
                        (onClick)="abrirFormularioCriacao()"
                    />
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th style="width: 11rem; min-width: 11rem; text-align: center; white-space: nowrap;">Ações</th>
                    <th pSortableColumn="nomeEmpreendimento" style="min-width: 22rem; white-space: nowrap;">
                        Nome
                        <p-sortIcon field="nomeEmpreendimento" />
                    </th>
                    <th pSortableColumn="descricao" style="min-width: 28rem; white-space: nowrap;">
                        Descrição
                        <p-sortIcon field="descricao" />
                    </th>
                    <th pSortableColumn="segmentoAtuacao" style="min-width: 12rem; white-space: nowrap;">
                        Categoria
                        <p-sortIcon field="segmentoAtuacao" />
                    </th>
                    <th pSortableColumn="municipio" style="min-width: 22rem; white-space: nowrap;">
                        Endereço
                        <p-sortIcon field="municipio" />
                    </th>
                    <th pSortableColumn="status" style="min-width: 8rem; white-space: nowrap;">
                        Status
                        <p-sortIcon field="status" />
                    </th>
                    <th pSortableColumn="dataCriacao" style="min-width: 10rem; white-space: nowrap;">
                        Cadastrado em
                        <p-sortIcon field="dataCriacao" />
                    </th>
                </tr>
            </ng-template>

            <ng-template #body let-emp>
                <tr>
                    <td style="text-align: center; white-space: nowrap; width: 11rem; min-width: 11rem;">
                        <span class="p-buttonset">
                            <p-button
                                icon="pi pi-pencil"
                                severity="warn"
                                [rounded]="true"
                                [text]="true"
                                pTooltip="Editar"
                                (onClick)="abrirFormularioEdicao(emp)"
                            />
                            <p-button
                                icon="pi pi-image"
                                severity="info"
                                [rounded]="true"
                                [text]="true"
                                pTooltip="Visualizar Imagens"
                                (onClick)="abrirImagens(emp)"
                            />
                            <p-button
                                icon="pi pi-map-marker"
                                severity="secondary"
                                [rounded]="true"
                                [text]="true"
                                pTooltip="Ver no Mapa"
                                (onClick)="abrirMapa(emp)"
                            />
                            <p-button
                                icon="pi pi-trash"
                                severity="danger"
                                [rounded]="true"
                                [text]="true"
                                pTooltip="Excluir"
                                (onClick)="excluirEmpreendimento(emp)"
                            />
                        </span>
                    </td>
                    <td style="padding: 0.75rem 0.75rem; min-width: 22rem;">
                        <strong style="font-size: 1rem; color: var(--text-color); display: block; margin-bottom: 0.25rem;">{{ emp.nomeEmpreendimento }}</strong>
                        <small style="color: gray; font-size: 0.8rem; display: block;">Responsável: {{ emp.nomeEmpreendedor }}</small>
                        <div style="display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.25rem;">
                            <small style="color: #6c757d; font-size: 0.78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 20rem;"><i class="pi pi-envelope" style="font-size: 0.75rem; margin-right: 0.25rem;"></i>{{ emp.contato }}</small>
                            <small style="color: #6c757d; font-size: 0.78rem; white-space: nowrap;"><i class="pi pi-whatsapp" style="font-size: 0.75rem; margin-right: 0.25rem; color: #25D366;"></i>{{ emp.whatsapp }}</small>
                        </div>
                    </td>
                    <td style="font-size: 0.85rem; color: #495057; line-height: 1.5; min-width: 28rem; max-width: 32rem; padding: 0.75rem;">
                        {{ emp.descricao }}
                    </td>
                    <td style="text-align: center; min-width: 12rem; white-space: nowrap;">
                        <p-tag [value]="emp.segmentoAtuacao" [severity]="obterSeveridade(emp.segmentoAtuacao)" [style]="{ 'font-size': '0.72rem', 'padding': '0.25rem 0.5rem', 'white-space': 'nowrap' }" />
                    </td>
                    <td style="font-size: 0.85rem; line-height: 1.5; min-width: 22rem; padding: 0.75rem;">
                        <div style="white-space: pre-wrap; word-break: break-word; max-width: 20rem;">
                            {{ obterEnderecoCompleto(emp) }}
                        </div>
                        <div style="margin-top: 0.2rem;">
                            <span style="color: gray; font-size: 0.78rem; white-space: nowrap;">CEP: {{ emp.endereco?.cep || 'Não informado' }}</span>
                        </div>
                    </td>
                    <td style="text-align: center; min-width: 8rem; white-space: nowrap;">
                        <p-tag
                           [value]="obterRotuloStatus(emp.status)"
                           [severity]="emp.status === 'ativo' ? 'success' : 'danger'"
                           [style]="{ 'font-size': '0.72rem', 'padding': '0.25rem 0.5rem' }"
                        />
                    </td>
                    <td style="text-align: center; min-width: 10rem; white-space: nowrap; font-size: 0.82rem; color: var(--text-color-secondary);">
                        @if (emp.dataCriacao) {
                            <div>{{ formatarData(emp.dataCriacao) }}</div>
                        } @else {
                            <span style="color: var(--surface-400, #aaa);">—</span>
                        }
                    </td>
                </tr>
            </ng-template>

            <ng-template #emptymessage>
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem;">Nenhum empreendimento cadastrado.</td>
                </tr>
            </ng-template>
        </p-table>
    </div>

    <!-- Dialog: Formulário de Criação / Edição -->
    <p-dialog
        [header]="empreendimentoEmEdicao ? 'Editar Empreendimento' : 'Novo Empreendimento'"
        [(visible)]="dialogFormularioVisivel"
        [modal]="true"
        [style]="{ width: '45rem' }"
        [draggable]="false"
        [resizable]="false"
        (onHide)="aoFecharDialogFormulario()"
    >
        <app-formulario-empreendimento
            [empreendimentoParaEditar]="empreendimentoEmEdicao"
            (formularioSalvo)="aoSalvarFormulario()"
            (formularioCancelado)="dialogFormularioVisivel = false"
        />
    </p-dialog>

    <!-- Dialog: Imagens do Empreendimento -->
    <p-dialog
        header="Imagens do Empreendimento"
        [(visible)]="dialogImagensVisivel"
        [modal]="true"
        [style]="{ width: '50vw' }"
        [draggable]="false"
        [resizable]="false"
    >
        @if (empreendimentoEmFoco?.imagens?.length) {
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
                @for (imagem of empreendimentoEmFoco?.imagens; track imagem) {
                    <p-image [src]="imagem" alt="Imagem" width="250" [preview]="true" />
                }
            </div>
        } @else {
            <div style="text-align: center; padding: 2rem; color: gray;">
                <i class="pi pi-camera" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i>
                <p>Nenhuma foto cadastrada para este empreendimento.</p>
            </div>
        }
    </p-dialog>
  `,
  styles: ``,
})
export class ListaEmpreendimento implements OnInit {
  private readonly servicoEmpreendimento = inject(EmpreendimentoService);
  private readonly servicoConfirmacao = inject(ConfirmationService);

  /**
   * Signal reativo alimentado pelo Observable em tempo real do Firebase.
   * O `toSignal` cancela o listener automaticamente quando o componente é destruído.
   * Valor inicial `[]` evita undefined enquanto o primeiro emit não chega.
   */
  listaEmpreendimentos = toSignal(
    this.servicoEmpreendimento.observarTodos(),
    { initialValue: [] as Empreendimento[] }
  );

  // --- Controle do Dialog de Formulário ---
  dialogFormularioVisivel: boolean = false;
  empreendimentoEmEdicao: Empreendimento | null = null;

  // --- Controle do Dialog de Imagens ---
  dialogImagensVisivel: boolean = false;
  empreendimentoEmFoco: Empreendimento | null = null;

  async ngOnInit() {
    await this.popularBancoDeDados();
  }

  /** Abre o formulário em modo criação */
  abrirFormularioCriacao(): void {
    this.empreendimentoEmEdicao = null;
    this.dialogFormularioVisivel = true;
  }

  /**
   * Abre o formulário em modo edição, preenchendo os campos com os dados do empreendimento.
   */
  abrirFormularioEdicao(empreendimento: Empreendimento): void {
    this.empreendimentoEmEdicao = empreendimento;
    this.dialogFormularioVisivel = true;
  }

  /** Chamado ao salvar no formulário: apenas fecha o dialog (a lista atualiza via listener) */
  aoSalvarFormulario(): void {
    this.dialogFormularioVisivel = false;
  }

  /** Garante que o estado de edição é limpo ao fechar o dialog */
  aoFecharDialogFormulario(): void {
    this.empreendimentoEmEdicao = null;
  }

  /**
   * Exibe o dialog de confirmação antes de excluir o empreendimento do Firebase.
   */
  excluirEmpreendimento(empreendimento: Empreendimento): void {
    this.servicoConfirmacao.confirm({
      message: `Deseja excluir o empreendimento <strong>${empreendimento.nomeEmpreendimento}</strong>? Esta ação não poderá ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        if (empreendimento.id) {
          await this.servicoEmpreendimento.excluir(empreendimento.id);
          // A lista atualiza automaticamente via listener em tempo real
        }
      }
    });
  }

  /** Converte timestamp Unix para o formato dd/MM/yyyy HH:mm */
  formatarData(timestamp: number): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  }

  /**
   * Abre o dialog de imagens e define o empreendimento em foco.
   * Utilizado pelo botão "Visualizar Imagens" na tabela.
   */
  abrirImagens(empreendimento: Empreendimento) {
    this.empreendimentoEmFoco = { ...empreendimento };
    if (this.empreendimentoEmFoco.imagens) {
      this.empreendimentoEmFoco.imagens = this.empreendimentoEmFoco.imagens.map(img =>
        img.startsWith('assets/') ? `/${img}` : img
      );
    }
    this.dialogImagensVisivel = true;
  }

  /**
   * Abre o Google Maps em nova guia buscando pelo endereço do empreendimento.
   * Prioriza o endereço textual (logradouro + bairro + cidade) em vez das coordenadas
   * para garantir resultados mais precisos na busca do Maps.
   */
  abrirMapa(empreendimento: Empreendimento) {
    const enderecoCompleto = this.obterEnderecoCompleto(empreendimento);

    if (!enderecoCompleto || enderecoCompleto.trim() === 'SC') {
      alert('Erro: Endereço indisponível para este empreendimento!');
      return;
    }

    const parametroBusca = encodeURIComponent(enderecoCompleto);
    const urlMapa = `https://www.google.com/maps/search/?api=1&query=${parametroBusca}`;
    window.open(urlMapa, '_blank');
  }

  /**
   * Define a severidade (cor) da Tag do PrimeNG com base no segmento de atuação.
   * Cada segmento recebe uma cor semântica para facilitar a identificação visual na tabela.
   */
  obterSeveridade(segmento: SegmentoAtuacao): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (segmento) {
      case 'Tecnologia': return 'info';
      case 'Comércio': return 'success';
      case 'Serviços': return 'secondary';
      case 'Indústria': return 'warn';
      case 'Agronegócio': return 'contrast';
      case 'Serviço Público': return 'danger';
      default: return 'info';
    }
  }

  /** Retorna o rótulo legível do status para exibição na Tag da tabela */
  obterRotuloStatus(status: StatusEmpreendimento): string {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  }

  /** Monta o endereço de forma completa para exibição e busca */
  obterEnderecoCompleto(emp: Empreendimento): string {
    const endereco = emp.endereco;
    if (!endereco) return emp.municipio ? `${emp.municipio}, SC` : '';

    const partes = [];
    if (endereco.logradouro) partes.push(endereco.logradouro);
    if (endereco.numero) partes.push(endereco.numero);
    if (endereco.complemento) partes.push(endereco.complemento);

    let enderecoP1 = partes.join(', ');
    if (endereco.bairro) enderecoP1 += ` - ${endereco.bairro}`;

    const enderecoP2 = emp.municipio ? `${emp.municipio}, SC` : 'SC';

    if (!enderecoP1) return enderecoP2;

    return `${enderecoP1}, ${enderecoP2}`;
  }

  private async popularBancoDeDados() {
    const registrosExistentes = await this.servicoEmpreendimento.buscarTodos();

    // Evita re-popular o banco ao recarregar a página
    if (registrosExistentes && registrosExistentes.length > 0) {
      console.log(`Banco de dados já contém ${registrosExistentes.length} empreendimentos.`);
      return;
    }

    console.log('Criando empreendimentos a partir da lista aleatória...');

    const mockEmpreendimentos = this.gerarDadosAleatorios().map(emp => ({
      ...emp,
      imagens: []
    })) as unknown as Empreendimento[];

    for (const empreendimento of mockEmpreendimentos) {
      const { id, ...dados } = empreendimento as any;
      await this.servicoEmpreendimento.criar(dados as Empreendimento);
    }

    console.log(`${mockEmpreendimentos.length} Empreendimentos inseridos com sucesso!`);
  }

  gerarDadosAleatorios() {

    return [
      {
        "id": "sc-001-weg",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "WEG S.A. - Matriz",
        "descricao": "Uma das maiores fabricantes de equipamentos elétricos do mundo, focada em motores, energia e automação.",
        "nomeEmpreendedor": "Werner Ricardo Voigt (Fundador)",
        "municipio": "Jaraguá do Sul",
        "segmentoAtuacao": "Indústria",
        "contato": "contato@weg.net",
        "whatsapp": "554732764000",
        "status": "ativo",
        "imagens": [
          "https://www.weg.net/institutional/images/logo-weg.png"
        ],
        "endereco": {
          "cep": "89256-900",
          "logradouro": "Avenida Prefeito Waldemar Grubba",
          "numero": "3300",
          "bairro": "Vila Lalau"
        },
        "geolocalizacao": {
          "latitude": -26.4674,
          "longitude": -49.1171
        }
      },
      {
        "id": "sc-002-senior",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Senior Sistemas",
        "descricao": "Referência em tecnologia para gestão no Brasil, com soluções em ERP, RH e logística.",
        "nomeEmpreendedor": "Jorge Cenci",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Tecnologia",
        "contato": "comercial@senior.com.br",
        "whatsapp": "554732213300",
        "status": "ativo",
        "imagens": [
          "https://www.senior.com.br/wp-content/uploads/2021/01/logo-senior.png"
        ],
        "endereco": {
          "cep": "89012-001",
          "logradouro": "Rua São Paulo",
          "numero": "825",
          "bairro": "Victor Konder"
        },
        "geolocalizacao": {
          "latitude": -26.9112,
          "longitude": -49.0706
        }
      },
      {
        "id": "sc-003-aurora",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Aurora Coop",
        "descricao": "Cooperativa central de agronegócio, referência na produção de alimentos de origem animal.",
        "nomeEmpreendedor": "Neivor Canton (Presidente)",
        "municipio": "Chapecó",
        "segmentoAtuacao": "Agronegócio",
        "contato": "sac@auroraalimentos.com.br",
        "whatsapp": "554933213000",
        "status": "ativo",
        "imagens": [
          "https://www.auroraalimentos.com.br/assets/img/logo-aurora.png"
        ],
        "endereco": {
          "cep": "89805-273",
          "logradouro": "Rua Doze de Dezembro",
          "numero": "118E",
          "bairro": "Centro"
        },
        "geolocalizacao": {
          "latitude": -27.1005,
          "longitude": -52.6148
        }
      },
      {
        "id": "sc-004-havan",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Havan - Loja Matriz",
        "descricao": "Uma das maiores redes de lojas de departamentos do Brasil, conhecida pelas réplicas da Estátua da Liberdade.",
        "nomeEmpreendedor": "Luciano Hang",
        "municipio": "Brusque",
        "segmentoAtuacao": "Comércio",
        "contato": "atendimento@havan.com.br",
        "whatsapp": "554732515000",
        "status": "ativo",
        "imagens": [
          "https://cliente.havan.com.br/Portal/Content/img/logo-havan.png"
        ],
        "endereco": {
          "cep": "88353-100",
          "logradouro": "Rodovia Antônio Heil",
          "numero": "250",
          "bairro": "Centro"
        },
        "geolocalizacao": {
          "latitude": -27.0988,
          "longitude": -48.9111
        }
      },
      {
        "id": "sc-005-ostradamus",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Restaurante Ostradamus",
        "descricao": "Renomado restaurante de frutos do mar especializado em ostras, localizado no histórico bairro do Ribeirão da Ilha.",
        "nomeEmpreendedor": "Jaime José de Barcelos",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Serviços",
        "contato": "contato@ostradamus.com.br",
        "whatsapp": "554833375711",
        "status": "ativo",
        "imagens": [
          "https://ostradamus.com.br/wp-content/uploads/logo.png"
        ],
        "endereco": {
          "cep": "88064-001",
          "logradouro": "Rodovia Baldicero Filomeno",
          "numero": "7640",
          "bairro": "Ribeirão da Ilha"
        },
        "geolocalizacao": {
          "latitude": -27.7214,
          "longitude": -48.5639
        }
      },
      {
        "id": "sc-001",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "WEG S.A.",
        "descricao": "Líder global em equipamentos eletroeletrônicos e energia.",
        "nomeEmpreendedor": "Werner Ricardo Voigt",
        "municipio": "Jaraguá do Sul",
        "segmentoAtuacao": "Indústria",
        "contato": "contato@weg.net",
        "whatsapp": "554732764000",
        "status": "ativo",
        "imagens": ["https://www.weg.net/institutional/images/logo-weg.png"],
        "endereco": { "cep": "89256-900", "logradouro": "Av. Prefeito Waldemar Grubba", "numero": "3300", "bairro": "Vila Lalau" },
        "geolocalizacao": { "latitude": -26.4674, "longitude": -49.1171 }
      },
      {
        "id": "sc-002",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Senior Sistemas",
        "descricao": "Softwares para gestão empresarial, logística e RH.",
        "nomeEmpreendedor": "Jorge Cenci",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Tecnologia",
        "contato": "vendas@senior.com.br",
        "whatsapp": "554732213300",
        "status": "ativo",
        "imagens": ["https://www.senior.com.br/wp-content/uploads/2021/01/logo-senior.png"],
        "endereco": { "cep": "89012-001", "logradouro": "Rua São Paulo", "numero": "825", "bairro": "Victor Konder" },
        "geolocalizacao": { "latitude": -26.9112, "longitude": -49.0706 }
      },
      {
        "id": "sc-003",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Havan Brusque",
        "descricao": "Loja de departamentos icônica com réplica da Estátua da Liberdade.",
        "nomeEmpreendedor": "Luciano Hang",
        "municipio": "Brusque",
        "segmentoAtuacao": "Comércio",
        "contato": "atendimento@havan.com.br",
        "whatsapp": "554732515000",
        "status": "ativo",
        "imagens": ["https://cliente.havan.com.br/Portal/Content/img/logo-havan.png"],
        "endereco": { "cep": "88353-100", "logradouro": "Rodovia Antônio Heil", "numero": "250", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.0988, "longitude": -48.9111 }
      },
      {
        "id": "sc-004",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Beto Carrero World",
        "descricao": "Maior parque temático da América Latina.",
        "nomeEmpreendedor": "João Batista Sérgio Murad",
        "municipio": "Penha",
        "segmentoAtuacao": "Serviços",
        "contato": "suporte@betocarrero.com.br",
        "whatsapp": "554732612222",
        "status": "ativo",
        "imagens": ["https://www.betocarrero.com.br/images/logo-beto-carrero-world.png"],
        "endereco": { "cep": "88385-000", "logradouro": "Rua Inácio Francisco de Souza", "numero": "1597", "bairro": "Praia de Armação" },
        "geolocalizacao": { "latitude": -26.8031, "longitude": -48.6189 }
      },
      {
        "id": "sc-005",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Aurora Coop",
        "descricao": "Cooperativa central de agronegócio e produção de alimentos.",
        "nomeEmpreendedor": "Neivor Canton",
        "municipio": "Chapecó",
        "segmentoAtuacao": "Agronegócio",
        "contato": "sac@auroraalimentos.com.br",
        "whatsapp": "554933213000",
        "status": "ativo",
        "imagens": ["https://www.auroraalimentos.com.br/assets/img/logo-aurora.png"],
        "endereco": { "cep": "89805-273", "logradouro": "Rua Doze de Dezembro", "numero": "118E", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.1005, "longitude": -52.6148 }
      },
      {
        "id": "sc-006",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Intelbras S.A.",
        "descricao": "Indústria de segurança, redes e telecomunicações.",
        "nomeEmpreendedor": "Altair Silvestri",
        "municipio": "São José",
        "segmentoAtuacao": "Indústria",
        "contato": "suporte@intelbras.com.br",
        "whatsapp": "554821060006",
        "status": "ativo",
        "imagens": ["https://www.intelbras.com/pt-br/templates/intelbras/images/logo.png"],
        "endereco": { "cep": "88122-001", "logradouro": "Rodovia BR-101", "numero": "Km 210", "bairro": "Área Industrial" },
        "geolocalizacao": { "latitude": -27.6015, "longitude": -48.6201 }
      },
      {
        "id": "sc-007",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Tigre Tubos e Conexões",
        "descricao": "Líder em soluções para construção civil e cuidados com a água.",
        "nomeEmpreendedor": "João Hansen Júnior",
        "municipio": "Joinville",
        "segmentoAtuacao": "Indústria",
        "contato": "contato@tigre.com",
        "whatsapp": "554734415000",
        "status": "ativo",
        "imagens": ["https://www.tigre.com.br/themes/custom/tigre/logo.svg"],
        "endereco": { "cep": "89219-900", "logradouro": "Rua Xavantes", "numero": "54", "bairro": "Atiradores" },
        "geolocalizacao": { "latitude": -26.3134, "longitude": -48.8525 }
      },
      {
        "id": "sc-008",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "RD Station",
        "descricao": "Plataforma líder em automação de marketing e CRM.",
        "nomeEmpreendedor": "Eric Santos",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Tecnologia",
        "contato": "comercial@rdstation.com",
        "whatsapp": "554830315400",
        "status": "ativo",
        "imagens": ["https://www.rdstation.com/wp-content/themes/rdstation/assets/img/logo-rdstation.svg"],
        "endereco": { "cep": "88032-005", "logradouro": "Rodovia Virgílio Várzea", "numero": "587", "bairro": "Itacorubi" },
        "geolocalizacao": { "latitude": -27.5794, "longitude": -48.5101 }
      },
      {
        "id": "sc-009",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Portobello S.A.",
        "descricao": "Maior empresa de revestimentos cerâmicos do Brasil.",
        "nomeEmpreendedor": "Cesar Gomes Junior",
        "municipio": "Tijucas",
        "segmentoAtuacao": "Indústria",
        "contato": "sac@portobello.com.br",
        "whatsapp": "554832771000",
        "status": "ativo",
        "imagens": ["https://www.portobello.com.br/static/img/logo-portobello.png"],
        "endereco": { "cep": "88200-000", "logradouro": "Rodovia BR-101", "numero": "Km 164", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.2514, "longitude": -48.6361 }
      },
      {
        "id": "sc-010",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Unifique Telecomunicações",
        "descricao": "Provedor de internet eleito o melhor do Brasil pela Anatel.",
        "nomeEmpreendedor": "Fabiano Busnardo",
        "municipio": "Timbó",
        "segmentoAtuacao": "Serviços",
        "contato": "atendimento@unifique.com.br",
        "whatsapp": "554733800800",
        "status": "ativo",
        "imagens": ["https://unifique.com.br/assets/img/logo-unifique.png"],
        "endereco": { "cep": "89120-000", "logradouro": "Rua Marechal Deodoro da Fonseca", "numero": "145", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -26.8247, "longitude": -49.2711 }
      },
      {
        "id": "sc-011",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Parque Vila Germânica",
        "descricao": "Centro de eventos sede da maior Oktoberfest das Américas.",
        "nomeEmpreendedor": "Prefeitura de Blumenau",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Serviço Público",
        "contato": "contato@parquevilagermanica.com.br",
        "whatsapp": "554733817700",
        "status": "ativo",
        "imagens": ["https://www.oktoberfestblumenau.com.br/wp-content/themes/oktoberfest/assets/img/logo-oktober.png"],
        "endereco": { "cep": "89036-225", "logradouro": "Rua Alberto Stein", "numero": "199", "bairro": "Velha" },
        "geolocalizacao": { "latitude": -26.9158, "longitude": -49.0847 }
      },
      {
        "id": "sc-012",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Tupy S.A.",
        "descricao": "Multinacional brasileira de metalurgia e fundição.",
        "nomeEmpreendedor": "Fernando Cestari de Rizzo",
        "municipio": "Joinville",
        "segmentoAtuacao": "Indústria",
        "contato": "tupy@tupy.com.br",
        "whatsapp": "554734417122",
        "status": "ativo",
        "imagens": ["https://www.tupy.com.br/wp-content/themes/tupy/assets/img/logo-tupy.svg"],
        "endereco": { "cep": "89206-900", "logradouro": "Rua Albano Schmidt", "numero": "3400", "bairro": "Boa Vista" },
        "geolocalizacao": { "latitude": -26.2861, "longitude": -48.8153 }
      },
      {
        "id": "sc-013",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Universidade Federal de Santa Catarina (UFSC)",
        "descricao": "Principal instituição de ensino superior pública do estado.",
        "nomeEmpreendedor": "Governo Federal",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Serviço Público",
        "contato": "reitoria@contato.ufsc.br",
        "whatsapp": "554837219000",
        "status": "ativo",
        "imagens": ["https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_UFSC.png"],
        "endereco": { "cep": "88040-900", "logradouro": "Campus Universitário Reitor João David Ferreira Lima", "numero": "s/n", "bairro": "Trindade" },
        "geolocalizacao": { "latitude": -27.6010, "longitude": -48.5186 }
      },
      {
        "id": "sc-014",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Neogrid",
        "descricao": "Especialista em gestão automática da cadeia de suprimentos.",
        "nomeEmpreendedor": "Miguel Abuhab",
        "municipio": "Joinville",
        "segmentoAtuacao": "Tecnologia",
        "contato": "vendas@neogrid.com",
        "whatsapp": "554734411200",
        "status": "ativo",
        "imagens": ["https://neogrid.com/wp-content/uploads/2021/04/Logo-Neogrid.png"],
        "endereco": { "cep": "89219-600", "logradouro": "Rua Dona Francisca", "numero": "8300", "bairro": "Distrito Industrial" },
        "geolocalizacao": { "latitude": -26.2305, "longitude": -48.8475 }
      },
      {
        "id": "sc-015",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Angeloni",
        "descricao": "Rede varejista de supermercados de alto padrão.",
        "nomeEmpreendedor": "Antenor Angeloni",
        "municipio": "Criciúma",
        "segmentoAtuacao": "Comércio",
        "contato": "sac@angeloni.com.br",
        "whatsapp": "554834313333",
        "status": "ativo",
        "imagens": ["https://www.angeloni.com.br/statics/angeloni/img/logo-angeloni.png"],
        "endereco": { "cep": "88801-110", "logradouro": "Avenida Centenário", "numero": "3434", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -28.6781, "longitude": -49.3731 }
      },
      {
        "id": "sc-016",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Cooperativa Agroindustrial Alfa",
        "descricao": "Uma das maiores cooperativas agroindustriais do sul.",
        "nomeEmpreendedor": "Romeo Bet",
        "municipio": "Chapecó",
        "segmentoAtuacao": "Agronegócio",
        "contato": "alfa@cooperalfa.com.br",
        "whatsapp": "554933217000",
        "status": "ativo",
        "imagens": ["https://www.cooperalfa.com.br/img/logo-alfa.png"],
        "endereco": { "cep": "89805-901", "logradouro": "Avenida Fernando Machado", "numero": "2580", "bairro": "Passo dos Fortes" },
        "geolocalizacao": { "latitude": -27.0855, "longitude": -52.6101 }
      },
      {
        "id": "sc-017",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Softplan",
        "descricao": "Desenvolvimento de softwares para gestão pública e justiça.",
        "nomeEmpreendedor": "Moacir Marafon",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Tecnologia",
        "contato": "contato@softplan.com.br",
        "whatsapp": "554830278000",
        "status": "ativo",
        "imagens": ["https://www.softplan.com.br/wp-content/themes/softplan-2022/assets/images/logo-softplan.svg"],
        "endereco": { "cep": "88054-600", "logradouro": "Rodovia SC-401", "numero": "s/n", "bairro": "Saco Grande" },
        "geolocalizacao": { "latitude": -27.5451, "longitude": -48.5032 }
      },
      {
        "id": "sc-018",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Oxford Porcelanas",
        "descricao": "Maior fabricante de cerâmica e porcelana de mesa das Américas.",
        "nomeEmpreendedor": "Irineu Weihermann",
        "municipio": "São Bento do Sul",
        "segmentoAtuacao": "Indústria",
        "contato": "vendas@oxfordporcelanas.com.br",
        "whatsapp": "554736313003",
        "status": "ativo",
        "imagens": ["https://www.oxfordporcelanas.com.br/images/logo_oxford.png"],
        "endereco": { "cep": "89282-902", "logradouro": "Rua Jorge Diener", "numero": "88", "bairro": "Oxford" },
        "geolocalizacao": { "latitude": -26.2415, "longitude": -49.3821 }
      },
      {
        "id": "sc-019",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Balneário Shopping (Almeida Junior)",
        "descricao": "Referência em varejo e lazer no litoral catarinense.",
        "nomeEmpreendedor": "Jaimes Almeida Junior",
        "municipio": "Balneário Camboriú",
        "segmentoAtuacao": "Comércio",
        "contato": "contato@almeidajunior.com.br",
        "whatsapp": "554732638444",
        "status": "ativo",
        "imagens": ["https://www.almeidajunior.com.br/sites/default/files/logo-almeida-junior.png"],
        "endereco": { "cep": "88339-000", "logradouro": "Avenida Santa Catarina", "numero": "1", "bairro": "Estados" },
        "geolocalizacao": { "latitude": -27.0012, "longitude": -48.6111 }
      },
      {
        "id": "sc-020",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Assembleia Legislativa (ALESC)",
        "descricao": "Sede do poder legislativo estadual de Santa Catarina.",
        "nomeEmpreendedor": "Estado de Santa Catarina",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Serviço Público",
        "contato": "ouvidoria@alesc.sc.gov.br",
        "whatsapp": "554832212500",
        "status": "ativo",
        "imagens": ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Logo_da_ALESC.png/250px-Logo_da_ALESC.png"],
        "endereco": { "cep": "88020-900", "logradouro": "Rua Dr. Jorge Luz Fontes", "numero": "310", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.6001, "longitude": -48.5471 }
      },
      {
        "id": "sc-021",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Malwee Malhas",
        "descricao": "Uma das principais empresas de moda do Brasil, referência em sustentabilidade.",
        "nomeEmpreendedor": "Wolfgang Weege",
        "municipio": "Jaraguá do Sul",
        "segmentoAtuacao": "Indústria",
        "contato": "sac@malwee.com.br",
        "whatsapp": "554733727272",
        "status": "ativo",
        "imagens": ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Logo_Malwee.png/300px-Logo_Malwee.png"],
        "endereco": { "cep": "89259-900", "logradouro": "Rua Bertha Weege", "numero": "132", "bairro": "Barra do Rio Cerro" },
        "geolocalizacao": { "latitude": -26.5052, "longitude": -49.1245 }
      },
      {
        "id": "sc-022",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Portonave",
        "descricao": "Primeiro terminal portuário privado do país e líder na movimentação de containers.",
        "nomeEmpreendedor": "Osmari de Castilho Ribas",
        "municipio": "Navegantes",
        "segmentoAtuacao": "Serviços",
        "contato": "portonave@portonave.com.br",
        "whatsapp": "554733496900",
        "status": "ativo",
        "imagens": ["https://www.portonave.com.br/wp-content/themes/portonave/assets/images/logo.png"],
        "endereco": { "cep": "88370-440", "logradouro": "Avenida Portuária Vicente Coelho", "numero": "1", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -26.8941, "longitude": -48.6534 }
      },
      {
        "id": "sc-023",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Engie Brasil Energia",
        "descricao": "Maior produtora privada de energia elétrica do Brasil, com sede em SC.",
        "nomeEmpreendedor": "Eduardo Sattamini",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Serviços",
        "contato": "comunicacao.brasil@engie.com",
        "whatsapp": "554832217000",
        "status": "ativo",
        "imagens": ["https://www.engie.com.br/wp-content/themes/engie/assets/images/logo-engie.png"],
        "endereco": { "cep": "88034-901", "logradouro": "Rua Paschoal Apóstolo Pítsica", "numero": "5064", "bairro": "Agronômica" },
        "geolocalizacao": { "latitude": -27.5755, "longitude": -48.5198 }
      },
      {
        "id": "sc-024",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Celesc - Centrais Elétricas de SC",
        "descricao": "Empresa estatal responsável pela geração e distribuição de energia no estado.",
        "nomeEmpreendedor": "Estado de Santa Catarina",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Serviço Público",
        "contato": "atendimento@celesc.com.br",
        "whatsapp": "5548999000196",
        "status": "ativo",
        "imagens": ["https://upload.wikimedia.org/wikipedia/pt/2/23/Celesc_Logo.png"],
        "endereco": { "cep": "88034-900", "logradouro": "Avenida Itamarati", "numero": "160", "bairro": "Itacorubi" },
        "geolocalizacao": { "latitude": -27.5812, "longitude": -48.5044 }
      },
      {
        "id": "sc-025",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Whirlpool Corporation",
        "descricao": "Unidade da maior fabricante de eletrodomésticos do mundo (marcas Consul e Brastemp).",
        "nomeEmpreendedor": "Marc Bitzer",
        "municipio": "Joinville",
        "segmentoAtuacao": "Indústria",
        "contato": "imprensa@whirlpool.com",
        "whatsapp": "554734414111",
        "status": "ativo",
        "imagens": ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Whirlpool_Corporation_logo.svg/320px-Whirlpool_Corporation_logo.svg.png"],
        "endereco": { "cep": "89219-900", "logradouro": "Rua Dona Francisca", "numero": "7200", "bairro": "Distrito Industrial" },
        "geolocalizacao": { "latitude": -26.2411, "longitude": -48.8415 }
      },
      {
        "id": "sc-026",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Karsten S.A.",
        "descricao": "Uma das empresas mais antigas do Brasil no setor têxtil e de cama, mesa e banho.",
        "nomeEmpreendedor": "Johann Karsten",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Indústria",
        "contato": "loja@karsten.com.br",
        "whatsapp": "554733314000",
        "status": "ativo",
        "imagens": ["https://www.karsten.com.br/arquivos/logo-karsten.png"],
        "endereco": { "cep": "89068-900", "logradouro": "Rua Werner Duwe", "numero": "5204", "bairro": "Testo Salto" },
        "geolocalizacao": { "latitude": -26.8152, "longitude": -49.1558 }
      },
      {
        "id": "sc-027",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Klabin - Unidade Otacílio Costa",
        "descricao": "Maior produtora e exportadora de papéis para embalagens do Brasil.",
        "nomeEmpreendedor": "Cristiano Teixeira",
        "municipio": "Otacílio Costa",
        "segmentoAtuacao": "Indústria",
        "contato": "faleconosco@klabin.com.br",
        "whatsapp": "554932214100",
        "status": "ativo",
        "imagens": ["https://klabin.com.br/o/klabin-theme/images/logo.png"],
        "endereco": { "cep": "88540-000", "logradouro": "Rodovia SC-425", "numero": "Km 01", "bairro": "Industrial" },
        "geolocalizacao": { "latitude": -27.4812, "longitude": -50.1154 }
      },
      {
        "id": "sc-028",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Bistek Supermercados",
        "descricao": "Rede de supermercados com forte presença no sul e litoral catarinense.",
        "nomeEmpreendedor": "Walter Ghislandi",
        "municipio": "Criciúma",
        "segmentoAtuacao": "Comércio",
        "contato": "sac@bistek.com.br",
        "whatsapp": "554834613000",
        "status": "ativo",
        "imagens": ["https://www.bistek.com.br/skin/frontend/bistek/default/images/logo.png"],
        "endereco": { "cep": "88804-001", "logradouro": "Rua Dolário dos Santos", "numero": "500", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -28.6751, "longitude": -49.3667 }
      },
      {
        "id": "sc-029",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Hering (Grupo Soma)",
        "descricao": "Famosa marca têxtil fundada em Blumenau, símbolo do vestuário básico.",
        "nomeEmpreendedor": "Hermann Hering",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Indústria",
        "contato": "sac@ciahering.com.br",
        "whatsapp": "554733213500",
        "status": "ativo",
        "imagens": ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Hering_logo.svg/300px-Hering_logo.svg.png"],
        "endereco": { "cep": "89010-900", "logradouro": "Rua Hermann Hering", "numero": "1790", "bairro": "Bom Retiro" },
        "geolocalizacao": { "latitude": -26.9254, "longitude": -49.0745 }
      },
      {
        "id": "sc-030",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "FG Empreendimentos",
        "descricao": "Construtora responsável por alguns dos maiores arranha-céus do Brasil.",
        "nomeEmpreendedor": "Francisco Graciola",
        "municipio": "Balneário Camboriú",
        "segmentoAtuacao": "Serviços",
        "contato": "comercial@fgempreendimentos.com.br",
        "whatsapp": "554733610001",
        "status": "ativo",
        "imagens": ["https://fgempreendimentos.com.br/assets/img/logo-fg.png"],
        "endereco": { "cep": "88330-015", "logradouro": "Avenida Brasil", "numero": "2260", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -26.9922, "longitude": -48.6341 }
      },
      {
        "id": "sc-031",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "BRF Concórdia",
        "descricao": "Unidade fundadora da Sadia, hoje uma das maiores empresas de alimentos do mundo.",
        "nomeEmpreendedor": "Attilio Fontana",
        "municipio": "Concórdia",
        "segmentoAtuacao": "Agronegócio",
        "contato": "sac@brf-br.com",
        "whatsapp": "554934414000",
        "status": "ativo",
        "imagens": ["https://www.brf-global.com/wp-content/themes/brf-global/assets/images/logo-brf.png"],
        "endereco": { "cep": "89700-000", "logradouro": "Rua Senador Attilio Fontana", "numero": "1", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.2345, "longitude": -52.0211 }
      },
      {
        "id": "sc-032",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Altenburg",
        "descricao": "Líder nacional na fabricação de travesseiros e têxteis para o lar.",
        "nomeEmpreendedor": "Johanna Altenburg",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Indústria",
        "contato": "sac@altenburg.com.br",
        "whatsapp": "554733316000",
        "status": "ativo",
        "imagens": ["https://www.altenburg.com.br/static/img/logo-altenburg.png"],
        "endereco": { "cep": "89066-000", "logradouro": "Rodovia BR-470", "numero": "Km 61", "bairro": "Badenfurt" },
        "geolocalizacao": { "latitude": -26.8521, "longitude": -49.1241 }
      },
      {
        "id": "sc-033",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Villa Francioni",
        "descricao": "Vinícola boutique referência em vinhos de altitude em Santa Catarina.",
        "nomeEmpreendedor": "Manoel Dilor de Freitas",
        "municipio": "São Joaquim",
        "segmentoAtuacao": "Agronegócio",
        "contato": "vendas@villafrancioni.com.br",
        "whatsapp": "554932338300",
        "status": "ativo",
        "imagens": ["https://villafrancioni.com.br/templates/padrao/imagens/logo.png"],
        "endereco": { "cep": "88600-000", "logradouro": "Rodovia SC-114", "numero": "Km 300", "bairro": "Cruzeiro" },
        "geolocalizacao": { "latitude": -28.2415, "longitude": -49.9124 }
      },
      {
        "id": "sc-034",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Schaefer Yachts",
        "descricao": "Maior estaleiro de barcos de lazer de luxo do Brasil.",
        "nomeEmpreendedor": "Marcio Schaefer",
        "municipio": "Palhoça",
        "segmentoAtuacao": "Indústria",
        "contato": "comercial@schaeferyachts.com.br",
        "whatsapp": "554821062600",
        "status": "ativo",
        "imagens": ["https://www.schaeferyachts.com.br/assets/img/logo.png"],
        "endereco": { "cep": "88137-082", "logradouro": "Avenida das Tipuanas", "numero": "150", "bairro": "Madri" },
        "geolocalizacao": { "latitude": -27.6431, "longitude": -48.6721 }
      },
      {
        "id": "sc-035",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Mueller Eletrodomésticos",
        "descricao": "Tradicional fabricante de lavadoras, fogões e eletrodomésticos.",
        "nomeEmpreendedor": "Walter Mueller",
        "municipio": "Timbó",
        "segmentoAtuacao": "Indústria",
        "contato": "sac@mueller.ind.br",
        "whatsapp": "554733816000",
        "status": "ativo",
        "imagens": ["https://www.mueller.ind.br/assets/img/logo.png"],
        "endereco": { "cep": "89120-000", "logradouro": "Rua Fritz Lorenz", "numero": "1413", "bairro": "Distrito Industrial" },
        "geolocalizacao": { "latitude": -26.8341, "longitude": -49.2612 }
      },
      {
        "id": "sc-036",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Tubarão Saneamento",
        "descricao": "Concessionária responsável pelos serviços de água e esgoto de Tubarão.",
        "nomeEmpreendedor": "Grupo Iguá",
        "municipio": "Tubarão",
        "segmentoAtuacao": "Serviços",
        "contato": "contato@tubaraosaneamento.com.br",
        "whatsapp": "5548991685823",
        "status": "ativo",
        "imagens": ["https://tubaraosaneamento.com.br/assets/images/logo.png"],
        "endereco": { "cep": "88701-100", "logradouro": "Rua Altamiro Guimarães", "numero": "645", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -28.4811, "longitude": -49.0022 }
      },
      {
        "id": "sc-037",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Casan - Companhia Catarinense de Águas",
        "descricao": "Empresa pública de saneamento e abastecimento de água do estado.",
        "nomeEmpreendedor": "Estado de Santa Catarina",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Serviço Público",
        "contato": "ouvidoria@casan.com.br",
        "whatsapp": "554899117711",
        "status": "ativo",
        "imagens": ["https://www.casan.com.br/assets/images/logo_casan.png"],
        "endereco": { "cep": "88020-010", "logradouro": "Rua Emílio Blum", "numero": "83", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.5925, "longitude": -48.5411 }
      },
      {
        "id": "sc-038",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Budweiser (Fábrica Ambev)",
        "descricao": "Uma das maiores unidades fabris da Ambev no sul do Brasil.",
        "nomeEmpreendedor": "Grupo Ambev",
        "municipio": "Lages",
        "segmentoAtuacao": "Indústria",
        "contato": "atendimento@ambev.com.br",
        "whatsapp": "554932519000",
        "status": "ativo",
        "imagens": ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ambev_logo.svg/300px-Ambev_logo.svg.png"],
        "endereco": { "cep": "88500-000", "logradouro": "Rodovia BR-116", "numero": "Km 210", "bairro": "Área Industrial" },
        "geolocalizacao": { "latitude": -27.7845, "longitude": -50.3121 }
      },
      {
        "id": "sc-039",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Clamed (Drogaria Catarinense)",
        "descricao": "Grupo farmacêutico dono das marcas Drogaria Catarinense e Preço Popular.",
        "nomeEmpreendedor": "Família Clamed",
        "municipio": "Joinville",
        "segmentoAtuacao": "Comércio",
        "contato": "sac@clamed.com.br",
        "whatsapp": "554734515500",
        "status": "ativo",
        "imagens": ["https://www.clamed.com.br/assets/img/logo-clamed.png"],
        "endereco": { "cep": "89201-401", "logradouro": "Rua XV de Novembro", "numero": "422", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -26.3015, "longitude": -48.8471 }
      },
      {
        "id": "sc-040",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Pamplona Alimentos",
        "descricao": "Líder no segmento de carne suína e embutidos em Santa Catarina.",
        "nomeEmpreendedor": "Família Pamplona",
        "municipio": "Rio do Sul",
        "segmentoAtuacao": "Agronegócio",
        "contato": "vendas@pamplona.com.br",
        "whatsapp": "554735313000",
        "status": "ativo",
        "imagens": ["https://www.pamplona.com.br/assets/img/logo.png"],
        "endereco": { "cep": "89160-000", "logradouro": "Rodovia BR-470", "numero": "Km 135", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.2145, "longitude": -49.6412 }
      },
      {
        "id": "sc-041",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Döhler S.A.",
        "descricao": "Importante indústria têxtil com foco em tecidos para decoração e lar.",
        "nomeEmpreendedor": "Carl Döhler",
        "municipio": "Joinville",
        "segmentoAtuacao": "Indústria",
        "contato": "sac@dohler.com.br",
        "whatsapp": "554734411600",
        "status": "ativo",
        "imagens": ["https://www.dohler.com.br/img/logo-dohler.png"],
        "endereco": { "cep": "89219-901", "logradouro": "Rua Dona Francisca", "numero": "4770", "bairro": "Distrito Industrial" },
        "geolocalizacao": { "latitude": -26.2612, "longitude": -48.8451 }
      },
      {
        "id": "sc-042",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Giassi Supermercados",
        "descricao": "Tradicional rede de supermercados do sul do estado.",
        "nomeEmpreendedor": "Zefiro Giassi",
        "municipio": "Içara",
        "segmentoAtuacao": "Comércio",
        "contato": "sac@giassi.com.br",
        "whatsapp": "554834413000",
        "status": "ativo",
        "imagens": ["https://www.giassi.com.br/assets/images/logo.png"],
        "endereco": { "cep": "88820-000", "logradouro": "Rua Vitória", "numero": "713", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -28.7121, "longitude": -49.3012 }
      },
      {
        "id": "sc-043",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Unimed Grande Florianópolis",
        "descricao": "Cooperativa de trabalho médico líder na capital catarinense.",
        "nomeEmpreendedor": "Cooperados Unimed",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Serviços",
        "contato": "sac@unimedflorianopolis.com.br",
        "whatsapp": "554832168000",
        "status": "ativo",
        "imagens": ["https://www.unimed.coop.br/logo.png"],
        "endereco": { "cep": "88015-100", "logradouro": "Rua Dom Jaime Câmara", "numero": "94", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -27.5945, "longitude": -48.5521 }
      },
      {
        "id": "sc-044",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Eliane Revestimentos",
        "descricao": "Famosa indústria de revestimentos cerâmicos e porcelanatos.",
        "nomeEmpreendedor": "Edson Gaidzinski",
        "municipio": "Cocal do Sul",
        "segmentoAtuacao": "Indústria",
        "contato": "comercial@eliane.com",
        "whatsapp": "554834412000",
        "status": "ativo",
        "imagens": ["https://www.eliane.com/wp-content/themes/eliane/assets/img/logo-eliane.svg"],
        "endereco": { "cep": "88845-000", "logradouro": "Rua Maximiliano Gaidzinski", "numero": "245", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -28.6012, "longitude": -49.3245 }
      },
      {
        "id": "sc-045",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Porto de Itajaí",
        "descricao": "Autoridade portuária municipal responsável pelo complexo portuário.",
        "nomeEmpreendedor": "Prefeitura de Itajaí",
        "municipio": "Itajaí",
        "segmentoAtuacao": "Serviço Público",
        "contato": "porto@portoitajai.com.br",
        "whatsapp": "554733418000",
        "status": "ativo",
        "imagens": ["https://www.portoitajai.com.br/img/logo-topo.png"],
        "endereco": { "cep": "88301-300", "logradouro": "Avenida Coronel Eugênio Müller", "numero": "622", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -26.9051, "longitude": -48.6541 }
      },
      {
        "id": "sc-046",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Cremer S.A.",
        "descricao": "Líder brasileira na fabricação de produtos para primeiros socorros e higiene.",
        "nomeEmpreendedor": "Giuseppe Cremer",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Indústria",
        "contato": "sac@cremer.com.br",
        "whatsapp": "554733218000",
        "status": "ativo",
        "imagens": ["https://www.cremer.com.br/skin/frontend/cremer/default/images/logo.png"],
        "endereco": { "cep": "89051-000", "logradouro": "Rua Iguaçu", "numero": "291", "bairro": "Itoupava Seca" },
        "geolocalizacao": { "latitude": -26.8912, "longitude": -49.0711 }
      },
      {
        "id": "sc-047",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Buddeymeyer S.A.",
        "descricao": "Referência nacional em produtos têxteis de luxo para banho.",
        "nomeEmpreendedor": "Família Buddemeyer",
        "municipio": "São Bento do Sul",
        "segmentoAtuacao": "Indústria",
        "contato": "vendas@buddemeyer.com.br",
        "whatsapp": "554736312100",
        "status": "ativo",
        "imagens": ["https://www.buddemeyer.com.br/images/logo.png"],
        "endereco": { "cep": "89285-900", "logradouro": "Rua Pastor Albert Schneider", "numero": "188", "bairro": "Centro" },
        "geolocalizacao": { "latitude": -26.2441, "longitude": -49.3812 }
      },
      {
        "id": "sc-048",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Cooper (Cooperativa de Consumo)",
        "descricao": "Uma das maiores cooperativas de consumo do Brasil.",
        "nomeEmpreendedor": "Cooperados",
        "municipio": "Blumenau",
        "segmentoAtuacao": "Comércio",
        "contato": "sac@cooper.coop.br",
        "whatsapp": "554733314600",
        "status": "ativo",
        "imagens": ["https://www.cooper.coop.br/img/logo-cooper.png"],
        "endereco": { "cep": "89012-000", "logradouro": "Rua Benjamin Constant", "numero": "2597", "bairro": "Vila Nova" },
        "geolocalizacao": { "latitude": -26.9021, "longitude": -49.0912 }
      },
      {
        "id": "sc-049",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "Tupy S.A. (Unidade Lages)",
        "descricao": "Fundição de componentes automotivos e de infraestrutura.",
        "nomeEmpreendedor": "Fernando Rizzo",
        "municipio": "Lages",
        "segmentoAtuacao": "Indústria",
        "contato": "lages@tupy.com.br",
        "whatsapp": "554932515000",
        "status": "ativo",
        "imagens": ["https://www.tupy.com.br/wp-content/themes/tupy/assets/img/logo-tupy.svg"],
        "endereco": { "cep": "88514-605", "logradouro": "Rua Archilau Batista do Amaral", "numero": "535", "bairro": "Universitário" },
        "geolocalizacao": { "latitude": -27.8124, "longitude": -50.3012 }
      },
      {
        "id": "sc-050",
        "dataCriacao": 1741381200000,
        "nomeEmpreendimento": "ACATE - Centro de Inovação",
        "descricao": "Associação Catarinense de Tecnologia, polo de inovação do estado.",
        "nomeEmpreendedor": "Iomani Engelmann",
        "municipio": "Florianópolis",
        "segmentoAtuacao": "Tecnologia",
        "contato": "contato@acate.com.br",
        "whatsapp": "554821072700",
        "status": "ativo",
        "imagens": ["https://www.acate.com.br/wp-content/themes/acate/assets/img/logo-acate.svg"],
        "endereco": { "cep": "88032-005", "logradouro": "Rodovia SC-401", "numero": "4100", "bairro": "Saco Grande" },
        "geolocalizacao": { "latitude": -27.5451, "longitude": -48.5032 }
      }
    ]
  }
}
