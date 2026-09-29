import { Component } from '@angular/core';
import { HeroesListComponent } from '@app/components/heroes-list/heroes-list.component';
import { Hero } from '@app/models/hero';

@Component({
  selector: 'app-heroes',
  imports: [HeroesListComponent],
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

  remove(hero: Hero): void {
    this.heroes = this.heroes.filter((currentHero) => currentHero !== hero);
  }
}
