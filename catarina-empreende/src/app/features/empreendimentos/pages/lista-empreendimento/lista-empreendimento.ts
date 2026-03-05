import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpreendimentoService } from '../../services/empreendimento.service';
import { Empreendimento, SegmentoAtuacao, StatusEmpreendimento } from '../../model/empreendimento.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-lista-empreendimento',
  imports: [
    CommonModule, TableModule, ButtonModule, DialogModule, ImageModule, TagModule, InputTextModule, IconFieldModule, InputIconModule, TooltipModule
  ],
  template: `
    <div class="card" style="margin: 0 auto; max-width: 1400px; width: 95%;">
        <h3 style="margin-top: 0; margin-bottom: 1rem;">Empreendimentos Catarinenses</h3>
        
        <p-table 
            #dt
            [value]="empreendimentos()" 
            [paginator]="true" 
            [rows]="10" 
            [scrollable]="true"
            [stripedRows]="true"
            scrollHeight="calc(100vh - 280px)"
            [tableStyle]="{ 'min-width': '80rem' }"
            styleClass="p-datatable-striped p-datatable-sm p-datatable-gridlines"
            [globalFilterFields]="['nomeEmpreendimento', 'descricao', 'nomeEmpreendedor', 'contato', 'whatsapp', 'segmentoAtuacao', 'municipio', 'status', 'endereco.logradouro']"
        >
            <ng-template #caption>
                <div style="display: flex; justify-content: flex-start;">
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
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 8rem; text-align: center;">Ações</th>
                    <th pSortableColumn="nomeEmpreendimento" style="min-width: 20rem;">
                        Nome 
                        <p-sortIcon field="nomeEmpreendimento" />
                    </th>
                    <th pSortableColumn="descricao">
                        Descrição
                        <p-sortIcon field="descricao" />
                    </th>
                    <th pSortableColumn="segmentoAtuacao">
                        Categoria
                        <p-sortIcon field="segmentoAtuacao" />
                    </th>
                    <th pSortableColumn="municipio">
                        Endereço
                        <p-sortIcon field="municipio" />
                    </th>
                    <th pSortableColumn="status">
                        Status
                        <p-sortIcon field="status" />
                    </th>
                </tr>
            </ng-template>
            <ng-template #body let-emp>
                <tr>
                    <td style="text-align: center; white-space: nowrap;">
                        <span class="p-buttonset">
                            <p-button 
                                icon="pi pi-pencil" 
                                severity="warn" 
                                [rounded]="true" 
                                [text]="true"
                                pTooltip="Editar Item"
                                (onClick)="editarEmpreendimento(emp)" 
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
                        </span>
                    </td>
                    <td style="padding: 1rem 0.5rem;">
                        <strong style="font-size: 1.15rem; color: var(--text-color); display: block; margin-bottom: 0.35rem;">{{ emp.nomeEmpreendimento }}</strong>
                        <small style="color: gray; font-size: 0.8rem;">Responsável: {{ emp.nomeEmpreendedor }}</small>
                        <div style="display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.25rem;">
                            <small style="color: #6c757d; font-size: 0.8rem;"><i class="pi pi-envelope" style="font-size: 0.8rem; margin-right: 0.25rem;"></i>{{ emp.contato }}</small>
                            <small style="color: #6c757d; font-size: 0.8rem;"><i class="pi pi-whatsapp" style="font-size: 0.8rem; margin-right: 0.25rem; color: #25D366;"></i>{{ emp.whatsapp }}</small>
                        </div>
                    </td>
                    <td style="font-size: 0.85rem; color: #495057; line-height: 1.4;">
                        {{ emp.descricao }}
                    </td>
                    <td>
                        <p-tag [value]="emp.segmentoAtuacao" [severity]="getSeverity(emp.segmentoAtuacao)" [style]="{ 'font-size': '0.7rem', 'padding': '0.2rem 0.4rem' }" />
                    </td>
                    <td style="font-size: 0.85rem; line-height: 1.4;">
                        {{ emp.endereco?.logradouro }} - {{ emp.endereco?.bairro }}<br>
                        <strong style="font-size: 0.9rem;">{{ emp.municipio }}</strong> <span style="color: gray; font-size: 0.8rem;">(CEP: {{ emp.endereco?.cep }})</span>
                    </td>
                    <td>
                        <p-tag 
                           [value]="getStatusDisplay(emp.status)" 
                           [severity]="emp.status === 'ativo' ? 'success' : 'danger'" 
                           [style]="{ 'font-size': '0.7rem', 'padding': '0.2rem 0.4rem' }"
                        />
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

    <p-dialog 
        header="Imagens do Empreendimento" 
        [(visible)]="displayDialog" 
        [modal]="true" 
        [style]="{ width: '50vw' }" 
        [draggable]="false" 
        [resizable]="false"
    >
        @if (empreendimentoSelecionado?.imagens?.length) {
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
                @for (imagem of empreendimentoSelecionado?.imagens; track imagem) {
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
  private empreendimentoService = inject(EmpreendimentoService);

  // Variável reativa para a tabela
  empreendimentos = signal<Empreendimento[]>([]);

  // Variáveis para controle do Modal de imagens
  displayDialog: boolean = false;
  empreendimentoSelecionado: Empreendimento | null = null;

  async ngOnInit() {
    await this.popularBancoDeDados();
    await this.carregarEmpreendimentos();
  }

  private async carregarEmpreendimentos() {
    const dados = await this.empreendimentoService.buscarTodos();
    this.empreendimentos.set(dados);
  }

  private async popularBancoDeDados() {
    const existentes = await this.empreendimentoService.buscarTodos();

    // Verifica se já existe algo gravado para evitar repetição ao atualizar a tela
    if (existentes && existentes.length > 0) {
      console.log(`Banco de dados já contém ${existentes.length} empreendimentos.`);
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

    const mockEmpreendimentos: Empreendimento[] = Array.from({ length: 20 }, (_, i) => {
      const empresa = empresas[i];
      const status = i % 4 === 0 ? 'inativo' : 'ativo'; // ~25% inativos

      // Gera um número de WhatsApp fictício, ex: 48 99999-0000
      const numeroWhats = `(48) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;

      return {
        nomeEmpreendimento: empresa.nome,
        descricao: empresa.desc,
        nomeEmpreendedor: empreendedores[i],
        municipio: municipios[i],
        segmentoAtuacao: empresa.seg as SegmentoAtuacao,
        contato: `contato@${empresa.nome.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
        whatsapp: numeroWhats,
        status: status as StatusEmpreendimento,
        imagens: [],
        endereco: {
          logradouro: `${logradouros[i]}, ${Math.floor(Math.random() * 1000) + 1}`,
          bairro: bairros[i],
          cep: `88${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`
        },
        geolocalizacao: {
          latitude: -27.5953778 - (Math.random() * 1.5),
          longitude: -48.5480499 - (Math.random() * 1.5)
        }
      };
    });

    for (const empreendimento of mockEmpreendimentos) {
      await this.empreendimentoService.criar(empreendimento);
    }

    console.log('20 Empreendimentos inseridos com sucesso!');
  }

  /**
 * Define a cor da Tag do PrimeNG baseada no segmento de atuação.
 */
  getSeverity(segmento: SegmentoAtuacao): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
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

  getStatusDisplay(status: StatusEmpreendimento): string {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  }

  /**
   * Acionado pelo botão "Imagens" na tabela, abre o Dialog modal e seta o item clicado.
   */
  abrirImagens(empreendimento: Empreendimento) {
    this.empreendimentoSelecionado = empreendimento;
    this.displayDialog = true;
  }

  /**
   * Placeholder acionado pelo botão "Editar" na tabela.
   * Será implementado futuramente.
   */
  editarEmpreendimento(empreendimento: Empreendimento) {
    console.log('Botão Editar clicado para:', empreendimento.nomeEmpreendimento);
    // TODO: Adicionar lógica para abrir modal/página de formulário para edição.
  }

  /**
   * Acionado pelo botão "Mapa", direciona o usuário para o Google Maps em uma nova guia,
   * buscando pelo endereço (logradouro, bairro, cidade, estado) em vez da geolocalização.
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

    const query = encodeURIComponent(enderecoCompleto);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapUrl, '_blank');
  }
}
