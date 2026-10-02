import { Routes } from '@angular/router';
import { HeroDetailsComponent } from '@app/components/hero-details/hero-details.component';
import { HeroesComponent } from '@app/components/heroes/heroes.component';

export const routes: Routes = [
  { path: '', component: HeroesComponent },
  { path: 'heroes/:id', component: HeroDetailsComponent },
  { path: '**', redirectTo: '' },
];
