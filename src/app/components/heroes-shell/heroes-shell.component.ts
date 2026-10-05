import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-heroes-shell',
  imports: [RouterOutlet],
  templateUrl: './heroes-shell.component.html',
})
export class HeroesShellComponent {}
