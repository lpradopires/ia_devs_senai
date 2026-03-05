import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, Button],
  template: `
    <p-menubar [model]="items">
        <ng-template #end>
            <p-button [icon]="isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'" [rounded]="true" [text]="true" (onClick)="toggleDarkMode()" />
        </ng-template>
    </p-menubar>

    <div style="padding: 2rem;">
      <router-outlet />
    </div>
  `,
})
export class App implements OnInit {
  protected readonly title = signal('catarina-empreende');
  isDarkMode = signal(false);

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Empreendimentos',
        icon: 'pi pi-building',
        routerLink: '/empreendimentos'
      }
    ];
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element) {
      element.classList.toggle('app-dark');
      this.isDarkMode.update(value => !value);
    }
  }
}
