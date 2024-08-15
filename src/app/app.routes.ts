import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    loadComponent: () => import('./forecasts-list/forecasts-list.component'),
    path: 'forecast/:zipcode',
  },
];
