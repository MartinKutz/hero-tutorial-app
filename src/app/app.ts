import { Component } from '@angular/core';
import { HeroesShellComponent } from './components/heroes-shell/heroes-shell.component';

@Component({
  selector: 'app-root',
  imports: [HeroesShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
