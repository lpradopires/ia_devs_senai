import { Routes } from '@angular/router';

import { ListaEmpreendimento } from './features/empreendimentos/pages/lista-empreendimento/lista-empreendimento';

export const routes: Routes = [
    {
        path: 'empreendimentos',
        component: ListaEmpreendimento
    }
];
