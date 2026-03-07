import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { EmpreendimentoService } from '../empreendimentos/services/empreendimento.service';
import { Empreendimento, SegmentoAtuacao } from '../empreendimentos/model/empreendimento.model';

// Regiões de Santa Catarina por município
const REGIOES_SC: Record<string, string> = {
  'Florianópolis': 'Grande Florianópolis',
  'São José': 'Grande Florianópolis',
  'Palhoça': 'Grande Florianópolis',
  'Biguaçu': 'Grande Florianópolis',
  'Santo Amaro da Imperatriz': 'Grande Florianópolis',
  'Garopaba': 'Grande Florianópolis',
  'Joinville': 'Norte Catarinense',
  'Jaraguá do Sul': 'Norte Catarinense',
  'São Francisco do Sul': 'Norte Catarinense',
  'Guaramirim': 'Norte Catarinense',
  'Schroeder': 'Norte Catarinense',
  'Blumenau': 'Vale do Itajaí',
  'Itajaí': 'Vale do Itajaí',
  'Balneário Camboriú': 'Vale do Itajaí',
  'Brusque': 'Vale do Itajaí',
  'Gaspar': 'Vale do Itajaí',
  'Indaial': 'Vale do Itajaí',
  'Navegantes': 'Vale do Itajaí',
  'Timbó': 'Vale do Itajaí',
  'Rio do Sul': 'Vale do Itajaí',
  'Tijucas': 'Vale do Itajaí',
  'Chapecó': 'Oeste Catarinense',
  'Concórdia': 'Oeste Catarinense',
  'Caçador': 'Oeste Catarinense',
  'Joaçaba': 'Oeste Catarinense',
  'Criciúma': 'Sul Catarinense',
  'Tubarão': 'Sul Catarinense',
  'Araranguá': 'Sul Catarinense',
  'Lages': 'Serrana',
  'Curitibanos': 'Serrana',
};

const CORES_SEGMENTO: Record<string, string> = {
  'Tecnologia': '#6366f1',
  'Comércio': '#22c55e',
  'Indústria': '#f59e0b',
  'Serviços': '#64748b',
  'Serviço Público': '#ef4444',
  'Agronegócio': '#84cc16',
};

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, SkeletonModule, TagModule, ButtonModule, TooltipModule],
  template: `
    <div class="dash-root">

      <!-- Cabeçalho -->
      <div class="dash-header">
        <div>
          <h2 class="dash-title">
            <i class="pi pi-chart-bar"></i>
            Dashboard — Empreendimentos Catarinenses
          </h2>
          <p class="dash-subtitle">
            @if (ultimaAtualizacao()) {
              Última atualização: {{ ultimaAtualizacao() | date:'dd/MM/yyyy HH:mm:ss' }}
            } @else {
              Dados atualizados em tempo real via Firebase
            }
          </p>
        </div>
        <div class="dash-header__actions">
          <button
            class="btn-atualizar"
            [class.btn-atualizar--loading]="atualizando()"
            (click)="atualizar()"
            [disabled]="atualizando()"
            pTooltip="Atualizar dados"
            tooltipPosition="left"
          >
            <i class="pi" [ngClass]="atualizando() ? 'pi-spin pi-spinner' : 'pi-refresh'"></i>
            <span>{{ atualizando() ? 'Atualizando...' : 'Atualizar' }}</span>
          </button>
          <div class="dash-status">
            <span class="status-dot"></span>
            <span>Ao vivo</span>
          </div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">

        <div class="kpi-card kpi-total">
          <div class="kpi-icon"><i class="pi pi-building"></i></div>
          <div class="kpi-info">
            <span class="kpi-label">Total de Empreendimentos</span>
            <span class="kpi-value">{{ total() }}</span>
          </div>
        </div>

        <div class="kpi-card kpi-ativos">
          <div class="kpi-icon"><i class="pi pi-check-circle"></i></div>
          <div class="kpi-info">
            <span class="kpi-label">Ativos</span>
            <span class="kpi-value">{{ totalAtivos() }}</span>
          </div>
        </div>

        <div class="kpi-card kpi-inativos">
          <div class="kpi-icon"><i class="pi pi-times-circle"></i></div>
          <div class="kpi-info">
            <span class="kpi-label">Inativos</span>
            <span class="kpi-value">{{ totalInativos() }}</span>
          </div>
        </div>

        <div class="kpi-card kpi-cidades">
          <div class="kpi-icon"><i class="pi pi-map-marker"></i></div>
          <div class="kpi-info">
            <span class="kpi-label">Municípios</span>
            <span class="kpi-value">{{ totalCidades() }}</span>
          </div>
        </div>

      </div>

      <!-- Gráficos -->
      <div class="charts-grid">

        <!-- Doughnut: Por Categoria -->
        <div class="chart-card">
          <div class="chart-card__header">
            <i class="pi pi-th-large"></i>
            <span>Por Categoria</span>
          </div>
          @if (total() > 0 && graficosVisiveis()) {
            <p-chart type="doughnut"
              [data]="chartCategoria()"
              [options]="optionsDoughnut"
              [style]="{'max-width': '340px', 'margin': '0 auto'}"
            />
          } @else {
            <div class="chart-empty"><i class="pi pi-spin pi-spinner"></i> {{ atualizando() ? 'Atualizando...' : 'Carregando...' }}</div>
          }
        </div>

        <!-- Bar: Por Cidade (top 10) -->
        <div class="chart-card chart-card--wide">
          <div class="chart-card__header">
            <i class="pi pi-map"></i>
            <span>Por Município (Top 10)</span>
          </div>
          @if (total() > 0 && graficosVisiveis()) {
            <p-chart type="bar"
              [data]="chartCidade()"
              [options]="optionsBar"
              [style]="{'width': '100%'}"
            />
          } @else {
            <div class="chart-empty"><i class="pi pi-spin pi-spinner"></i> {{ atualizando() ? 'Atualizando...' : 'Carregando...' }}</div>
          }
        </div>

        <!-- Bar: Por Região -->
        <div class="chart-card chart-card--wide">
          <div class="chart-card__header">
            <i class="pi pi-globe"></i>
            <span>Por Região</span>
          </div>
          @if (total() > 0 && graficosVisiveis()) {
            <p-chart type="bar"
              [data]="chartRegiao()"
              [options]="optionsBarRegiao"
              [style]="{'width': '100%'}"
            />
          } @else {
            <div class="chart-empty"><i class="pi pi-spin pi-spinner"></i> {{ atualizando() ? 'Atualizando...' : 'Carregando...' }}</div>
          }
        </div>

      </div>

      <!-- Tabela Resumo Por Categoria -->
      <div class="resumo-card">
        <div class="chart-card__header">
          <i class="pi pi-list"></i>
          <span>Resumo Por Categoria</span>
        </div>
        <div class="resumo-grid">
          @for (item of resumoCategoria(); track item.segmento) {
            <div class="resumo-item">
              <span class="resumo-dot" [style.background]="item.cor"></span>
              <span class="resumo-segmento">{{ item.segmento }}</span>
              <span class="resumo-count">{{ item.total }}</span>
              <div class="resumo-bar-bg">
                <div class="resumo-bar-fill" [style.width.%]="item.pct" [style.background]="item.cor"></div>
              </div>
              <span class="resumo-pct">{{ item.pct | number:'1.0-1' }}%</span>
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: `
    .dash-root {
      padding: 0 0.5rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header */
    .dash-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .dash-header__actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .dash-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .dash-title i { color: var(--primary-color); }
    .dash-subtitle {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-color-secondary);
    }
    .dash-status {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.25);
      border-radius: 20px;
      padding: 0.3rem 0.85rem;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }

    /* Botão Atualizar */
    .btn-atualizar {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.18s, color 0.18s, transform 0.15s, box-shadow 0.18s;
      white-space: nowrap;
    }
    .btn-atualizar:hover:not(:disabled) {
      background: var(--primary-color);
      color: #fff;
      box-shadow: 0 4px 14px rgba(99,102,241,0.35);
      transform: translateY(-1px);
    }
    .btn-atualizar:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .btn-atualizar--loading {
      border-color: var(--primary-300, #a5b4fc);
      color: var(--primary-300, #a5b4fc);
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .kpi-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.35rem 1.5rem;
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      color: #fff;
    }
    .kpi-card::after {
      content: '';
      position: absolute;
      top: -30%;
      right: -10%;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      pointer-events: none;
    }
    .kpi-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.2);
    }
    .kpi-total   { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); }
    .kpi-ativos  { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); }
    .kpi-inativos{ background: linear-gradient(135deg, #dc2626 0%, #f87171 100%); }
    .kpi-cidades { background: linear-gradient(135deg, #d97706 0%, #fbbf24 100%); }
    .kpi-icon {
      width: 54px; height: 54px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
      background: rgba(255,255,255,0.2);
      color: #fff;
      backdrop-filter: blur(4px);
    }
    .kpi-info { display: flex; flex-direction: column; gap: 0.15rem; }
    .kpi-label { font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.06em; }
    .kpi-value { font-size: 2.2rem; font-weight: 900; color: #fff; line-height: 1; text-shadow: 0 1px 4px rgba(0,0,0,0.15); }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      grid-template-rows: auto auto;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    @media (max-width: 900px) {
      .charts-grid { grid-template-columns: 1fr; }
    }
    .chart-card {
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .chart-card--wide {
      grid-column: 2;
    }
    .chart-card--wide:first-of-type { grid-row: 1; }
    .chart-card--wide:last-of-type  { grid-row: 2; grid-column: 1 / -1; }

    .chart-card__header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--surface-border);
    }
    .chart-card__header i { color: var(--primary-color); font-size: 1rem; }
    .chart-empty {
      text-align: center;
      color: var(--text-color-secondary);
      padding: 3rem 0;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    /* Resumo */
    .resumo-card {
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .resumo-grid { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem; }
    .resumo-item {
      display: grid;
      grid-template-columns: 12px 1fr 48px 1fr 52px;
      align-items: center;
      gap: 0.75rem;
    }
    .resumo-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .resumo-segmento { font-size: 0.88rem; font-weight: 500; color: var(--text-color); }
    .resumo-count { font-size: 0.88rem; font-weight: 700; color: var(--text-color); text-align: right; }
    .resumo-bar-bg { background: var(--surface-border); border-radius: 99px; height: 8px; overflow: hidden; }
    .resumo-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
    .resumo-pct { font-size: 0.78rem; color: var(--text-color-secondary); text-align: right; }
  `
})
export class DashbordComponent {
  private readonly svc = inject(EmpreendimentoService);

  /** Signal reativo com a lista completa de empreendimentos */
  private readonly lista = toSignal(
    this.svc.observarTodos(),
    { initialValue: [] as Empreendimento[] }
  );

  /** Controla o estado de carregamento do botão Atualizar */
  atualizando = signal(false);

  /** Timestamp da última atualização manual */
  ultimaAtualizacao = signal<Date | null>(null);

  /** Força a atualização visual: esconde os gráficos e volta a exibi-los */
  graficosVisiveis = signal(true);

  /** Dispara atualização visual temporária dos gráficos */
  async atualizar() {
    this.atualizando.set(true);
    this.graficosVisiveis.set(false);
    // Pequena pausa para forçar re-render dos gráficos
    await new Promise(res => setTimeout(res, 600));
    this.graficosVisiveis.set(true);
    this.ultimaAtualizacao.set(new Date());
    this.atualizando.set(false);
  }

  // --- KPIs ---
  total = computed(() => this.lista().length);
  totalAtivos = computed(() => this.lista().filter(e => e.status === 'ativo').length);
  totalInativos = computed(() => this.lista().filter(e => e.status === 'inativo').length);
  totalCidades = computed(() => new Set(this.lista().map(e => e.municipio)).size);

  // --- Gráfico: Por Categoria ---
  chartCategoria = computed(() => {
    const contagem: Record<string, number> = {};
    for (const emp of this.lista()) {
      contagem[emp.segmentoAtuacao] = (contagem[emp.segmentoAtuacao] || 0) + 1;
    }
    const labels = Object.keys(contagem);
    return {
      labels,
      datasets: [{
        data: labels.map(l => contagem[l]),
        backgroundColor: labels.map(l => CORES_SEGMENTO[l] ?? '#94a3b8'),
        hoverOffset: 12,
        borderWidth: 2,
        borderColor: 'transparent',
      }]
    };
  });

  // --- Gráfico: Por Cidade (top 10) ---
  chartCidade = computed(() => {
    const contagem: Record<string, number> = {};
    for (const emp of this.lista()) {
      contagem[emp.municipio] = (contagem[emp.municipio] || 0) + 1;
    }
    const sorted = Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const labels = sorted.map(e => e[0]);
    const values = sorted.map(e => e[1]);
    return {
      labels,
      datasets: [{
        label: 'Empreendimentos',
        data: values,
        backgroundColor: 'rgba(99,102,241,0.75)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 6,
      }]
    };
  });

  // --- Gráfico: Por Região ---
  chartRegiao = computed(() => {
    const contagem: Record<string, number> = {};
    for (const emp of this.lista()) {
      const regiao = REGIOES_SC[emp.municipio] ?? 'Outra Região';
      contagem[regiao] = (contagem[regiao] || 0) + 1;
    }
    const regioesPaleta = [
      '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#84cc16', '#0ea5e9', '#ec4899'
    ];
    const sorted = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(e => e[0]);
    const values = sorted.map(e => e[1]);
    return {
      labels,
      datasets: [{
        label: 'Empreendimentos',
        data: values,
        backgroundColor: labels.map((_, i) => regioesPaleta[i % regioesPaleta.length]),
        borderRadius: 6,
        borderWidth: 0,
      }]
    };
  });

  // --- Tabela de Resumo por Categoria ---
  resumoCategoria = computed(() => {
    const total = this.total();
    if (total === 0) return [];
    const contagem: Record<string, number> = {};
    for (const emp of this.lista()) {
      contagem[emp.segmentoAtuacao] = (contagem[emp.segmentoAtuacao] || 0) + 1;
    }
    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .map(([segmento, count]) => ({
        segmento,
        total: count,
        pct: (count / total) * 100,
        cor: CORES_SEGMENTO[segmento] ?? '#94a3b8',
      }));
  });

  // --- Opções de Chart.js ---
  readonly optionsDoughnut = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}`
        }
      }
    },
    cutout: '65%',
  };

  readonly optionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2.5,
    indexAxis: 'x',
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  readonly optionsBarRegiao = {
    ...this.optionsBar,
    plugins: { legend: { display: false } },
  };
}
