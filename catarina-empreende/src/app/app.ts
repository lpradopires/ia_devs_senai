import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Button],
  template: `
    <nav class="app-navbar">
      <div class="app-navbar__brand">
        <img src="bandeira-sc.png" alt="Bandeira de Santa Catarina" style="height: 1.6rem; border-radius: 2px; object-fit: cover;">
        <span>Catarina Empreende</span>
      </div>

      <div class="app-navbar__links">
        <a
          routerLink="/"
          routerLinkActive="nav-item-active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-item"
        >
          <i class="pi pi-home"></i>
          <span>Dashboard</span>
        </a>

        <a
          routerLink="/empreendimentos"
          routerLinkActive="nav-item-active"
          class="nav-item"
        >
          <i class="pi pi-building"></i>
          <span>Empreendimentos</span>
        </a>
      </div>

      <div class="app-navbar__end">
        <p-button
          [icon]="modoEscuroAtivo() ? 'pi pi-sun' : 'pi pi-moon'"
          [rounded]="true"
          [text]="true"
          (onClick)="alternarModoEscuro()"
        />
      </div>
    </nav>

    <div style="padding: 1rem;">
      <router-outlet />
    </div>
  `,
  styles: `
    .app-navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0 1.5rem;
      height: 3.5rem;
      background: var(--surface-card);
      border-bottom: 1px solid var(--surface-border);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    :host-context(.app-dark) .app-navbar {
      background: var(--surface-card);
      border-bottom-color: var(--surface-border);
      box-shadow: 0 2px 12px rgba(0,0,0,0.35);
    }

    .app-navbar__brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--primary-color);
      margin-right: 1rem;
      white-space: nowrap;
    }

    .app-navbar__links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex: 1;
    }

    .app-navbar__end {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-color-secondary);
      text-decoration: none;
      transition: background 0.18s, color 0.18s;
      white-space: nowrap;
    }

    .nav-item:hover {
      background: var(--surface-hover);
      color: var(--text-color);
    }

    :host-context(.app-dark) .nav-item:hover {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-color);
    }

    .nav-item-active {
      background: var(--primary-color, #3b82f6) !important;
      color: #fff !important;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .nav-item-active:hover {
      background: var(--primary-600, #2563eb) !important;
      color: #fff !important;
    }
  `
})
export class App {
  /** Signal que controla o estado do modo escuro da aplicação */
  modoEscuroAtivo = signal(false);

  /** Alterna entre o tema claro e escuro, adicionando/removendo a classe 'app-dark' no HTML raiz */
  alternarModoEscuro() {
    const elementoHtml = document.querySelector('html');
    if (elementoHtml) {
      elementoHtml.classList.toggle('app-dark');
      this.modoEscuroAtivo.update(valorAtual => !valorAtual);
    }
  }
}

