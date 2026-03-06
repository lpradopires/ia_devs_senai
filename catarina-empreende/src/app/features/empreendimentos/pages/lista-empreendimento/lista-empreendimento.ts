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
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 20rem;">
                            {{ emp.endereco?.logradouro }}{{ emp.endereco?.bairro ? ' - ' + emp.endereco?.bairro : '' }}
                        </div>
                        <div style="margin-top: 0.2rem;">
                            <strong style="font-size: 0.9rem;">{{ emp.municipio }}</strong>
                            <span style="color: gray; font-size: 0.78rem; margin-left: 0.4rem; white-space: nowrap;">CEP: {{ emp.endereco?.cep }}</span>
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
    this.empreendimentoEmFoco = empreendimento;
    this.dialogImagensVisivel = true;
  }

  /**
   * Abre o Google Maps em nova guia buscando pelo endereço do empreendimento.
   * Prioriza o endereço textual (logradouro + bairro + cidade) em vez das coordenadas
   * para garantir resultados mais precisos na busca do Maps.
   */
  abrirMapa(empreendimento: Empreendimento) {
    const endereco = empreendimento.endereco;
    const logradouro = endereco?.logradouro || '';
    const bairro = endereco?.bairro ? `- ${endereco.bairro}` : '';
    const cidade = empreendimento.municipio || '';

    const enderecoCompleto = `${logradouro} ${bairro}, ${cidade}, SC`.trim();

    if (!logradouro && !cidade) {
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

  private async popularBancoDeDados() {
    const registrosExistentes = await this.servicoEmpreendimento.buscarTodos();

    // Evita re-popular o banco ao recarregar a página
    if (registrosExistentes && registrosExistentes.length > 0) {
      console.log(`Banco de dados já contém ${registrosExistentes.length} empreendimentos.`);
      return;
    }

    console.log('Criando 20 empreendimentos reais no Firebase...');

    const empresas = [
      { nome: 'Tech Hub Floripa', seg: 'Tecnologia', desc: 'Aceleradora de Startups e Coworking.' },
      { nome: 'Mercado Central SC', seg: 'Comércio', desc: 'Venda de produtos regionais.' },
      { nome: 'Agropecuária Vale Verde', seg: 'Agronegócio', desc: 'Insumos e maquinário agrícola.' },
      { nome: 'Fábrica de Móveis Silva', seg: 'Indústria', desc: 'Produção sob medida de móveis planejados.' },
      { nome: 'Clínica Bem Estar', seg: 'Serviços', desc: 'Atendimentos de saúde ambulatoriais.' },
      { nome: 'Loja de Informática Byte', seg: 'Comércio', desc: 'Assistência técnica e peças de TI.' },
      { nome: 'Posto de Saúde Central', seg: 'Serviço Público', desc: 'Unidade básica de atendimento médico e vacinação.' },
      { nome: 'Fazenda Sol Nascente', seg: 'Agronegócio', desc: 'Produção sustentável de grãos e hortaliças.' },
      { nome: 'Celesc Distribuição', seg: 'Serviço Público', desc: 'Companhia de energia elétrica do estado.' },
      { nome: 'Indústria Têxtil Catarina', seg: 'Indústria', desc: 'Fabricação de roupas íntimas e camuflados.' },
      { nome: 'Restaurante Sabor do Mar', seg: 'Comércio', desc: 'Especialista em frutos do mar.' },
      { nome: 'Prefeitura Municipal', seg: 'Serviço Público', desc: 'Órgão de administração do município.' },
      { nome: 'Startup InovaTech', seg: 'Tecnologia', desc: 'Plataforma SaaS de gestão para restaurantes.' },
      { nome: 'Supermercado Preço Bom', seg: 'Comércio', desc: 'Rede varejista de alimentos secos e molhados.' },
      { nome: 'Cidasc', seg: 'Serviço Público', desc: 'Controle de qualidade e segurança agrícola estadual.' },
      { nome: 'Construtora Edificar', seg: 'Indústria', desc: 'Edificações civis e infraestrutura moderna.' },
      { nome: 'Escola de Idiomas Global', seg: 'Serviços', desc: 'Ensino de Inglês e Espanhol corporativo.' },
      { nome: 'Batalhão de Polícia Militar', seg: 'Serviço Público', desc: 'Segurança pública regional.' },
      { nome: 'Hortifruti Frescor', seg: 'Comércio', desc: 'Frutas e vegetais fresquinhos trazidos todo dia.' },
      { nome: 'Metalúrgica Ferro Forte', seg: 'Indústria', desc: 'Transformação pesada de metais e soldagem.' }
    ];

    const empreendedores = ['Carlos Cunha', 'Mariana Silva', 'João Batista', 'Fernanda Costa', 'Roberto Alves', 'Amanda Lima', 'Lucas Santos', 'Juliana Rocha', 'Diego Pereira', 'Camila Oliveira', 'Rafael Mendes', 'Natália Gomes', 'Marcelo Ribeiro', 'Letícia Carvalho', 'Thiago Almeida', 'Beatriz Martins', 'Gabriel Ferreira', 'Patrícia Souza', 'Antônio Pereira', 'Vanessa Rodrigues'];
    const municipios = ['Florianópolis', 'São José', 'Palhoça', 'Biguaçu', 'Joinville', 'Blumenau', 'Itajaí', 'Balneário Camboriú', 'Chapecó', 'Criciúma', 'Lages', 'Tubarão', 'Jaraguá do Sul', 'Brusque', 'Rio do Sul', 'Gaspar', 'Indaial', 'Navegantes', 'Caçador', 'Concórdia'];
    const logradouros = ['Rua XV de Novembro', 'Avenida Brasil', 'Rua Felipe Schmidt', 'Avenida Beira Mar', 'Rua das Flores', 'Rodovia SC-401', 'Rua Sete de Setembro', 'Avenida Central', 'Rua Almirante Barroso', 'Rua João Pinto', 'Avenida Hercílio Luz', 'Rua Bocaiúva', 'Rua Tenente Silveira', 'Rodovia BR-101', 'Rua Anita Garibaldi', 'Avenida Mauro Ramos', 'Rua Conselheiro Mafra', 'Rua Trajano', 'Avenida Rio Branco', 'Rodovia Admar Gonzaga'];
    const bairros = ['Centro', 'Trindade', 'Kobrasol', 'Campinas', 'Agronômica', 'Itacorubi', 'Saco Grande', 'Estreito', 'Coqueiros', 'Atiradores', 'Vila Nova', 'Fazenda', 'Pioneiros', 'Eficapi', 'Próspera', 'Coral', 'Oficinas', 'Barra', 'Azambuja', 'Canta Galo'];

    const mockEmpreendimentos: Empreendimento[] = Array.from({ length: 20 }, (_, indice) => {
      const empresa = empresas[indice];
      const statusGerado = indice % 4 === 0 ? 'inativo' : 'ativo';
      const numeroWhatsApp = `(48) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;

      return {
        nomeEmpreendimento: empresa.nome,
        descricao: empresa.desc,
        nomeEmpreendedor: empreendedores[indice],
        municipio: municipios[indice],
        segmentoAtuacao: empresa.seg as SegmentoAtuacao,
        contato: `contato@${empresa.nome.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
        whatsapp: numeroWhatsApp,
        status: statusGerado as StatusEmpreendimento,
        imagens: [],
        endereco: {
          logradouro: `${logradouros[indice]}, ${Math.floor(Math.random() * 1000) + 1}`,
          bairro: bairros[indice],
          cep: `88${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`
        },
        geolocalizacao: {
          latitude: -27.5953778 - (Math.random() * 1.5),
          longitude: -48.5480499 - (Math.random() * 1.5)
        }
      };
    });

    for (const empreendimento of mockEmpreendimentos) {
      await this.servicoEmpreendimento.criar(empreendimento);
    }

    console.log('20 Empreendimentos inseridos com sucesso!');
  }
}
