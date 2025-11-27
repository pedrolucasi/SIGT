import { Routes } from '@angular/router';
import { DashboardTccComponent } from './components/dashboard-tcc/dashboard-tcc.component';
import { TccRegistrationComponent } from './components/tcc-registration/tcc-registration.component';

export const routes: Routes = [
  { path: 'agenda-tcc', component: DashboardTccComponent, title: 'SIGT'},
  { path: 'cadastro-tcc', component: TccRegistrationComponent, title: 'SIGT | Cadastrar TCC' },
];
