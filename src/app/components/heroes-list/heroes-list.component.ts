import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';

@Component({
  selector: 'app-heroes-list',
  imports: [RouterLink],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent {
  private readonly heroService = inject(HeroService);

  readonly heroes = this.heroService.heroes;

  delete(hero: Hero): void {
    this.heroService.removeHero(hero);
  }
}
