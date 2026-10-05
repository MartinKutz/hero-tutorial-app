import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from '@app/models/hero';

@Component({
  selector: 'app-heroes-list',
  imports: [RouterLink],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent {
  readonly heroes = input<Hero[]>([]);
  readonly deleteHero = output<Hero>();

  delete(hero: Hero): void {
    this.deleteHero.emit(hero);
  }
}
