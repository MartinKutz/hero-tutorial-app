import { Component } from '@angular/core';
import { Hero } from '@app/models/hero';

@Component({
  selector: 'app-heroes',
  imports: [],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent {
  heroes: Hero[] = [];

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this.heroes.push({ name });
  }
}
