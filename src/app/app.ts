import { Component } from '@angular/core';
import { HeroesComponent } from './components/heroes/heroes.component';

@Component({
  selector: 'app-root',
  imports: [HeroesComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
