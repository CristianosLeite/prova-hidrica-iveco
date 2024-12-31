import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main/run',
    pathMatch: 'full'
  },
  {
    path: 'main/:page',
    component: MainComponent
  },
  {
    path: 'main/:page/:id',
    component: MainComponent
  }
];
