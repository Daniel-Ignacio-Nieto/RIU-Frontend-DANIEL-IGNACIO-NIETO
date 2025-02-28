import { Routes } from '@angular/router';
import { HeroListComponent } from './pages/hero-list/hero-list.component';
import { HeroFormComponent } from './pages/hero-form/hero-form.component';

export const routes: Routes = [
  {
    path: 'heroes',
    children: [
      { path: '', component: HeroListComponent },
      { path: 'form', component: HeroFormComponent },
    ],
  },
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', redirectTo: '/heroes' },
];
