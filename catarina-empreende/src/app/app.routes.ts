import { Routes } from '@angular/router';

import { ListaEmpreendimento } from './features/empreendimentos/pages/lista-empreendimento/lista-empreendimento';
import { DashbordComponent } from './features/dashbord/dashbord';

export const routes: Routes = [
    {
        path: '',
        component: DashbordComponent
    },
    {
        path: 'empreendimentos',
        component: ListaEmpreendimento
    }
];
