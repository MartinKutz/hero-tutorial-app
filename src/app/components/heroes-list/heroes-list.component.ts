import { Component, input, output } from '@angular/core';
import { Hero } from '@app/models/hero';

@Component({
  selector: 'app-heroes-list',
  imports: [],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent {
  readonly heroes = input<Hero[]>([]);
  readonly deleteHero = output<Hero>();

  delete(hero: Hero): void {
    if (!hero) {
      return;
    }

    this.deleteHero.emit(hero);
  }
}
