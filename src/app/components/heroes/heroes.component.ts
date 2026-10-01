import { Component, inject } from '@angular/core';
import { HeroesListComponent } from '@app/components/heroes-list/heroes-list.component';
import { Hero } from '@app/models/hero';
import { LoggingService } from '@app/services/logging.service';

@Component({
  selector: 'app-heroes',
  imports: [HeroesListComponent],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent {
  private readonly logger = inject(LoggingService);

  heroes: Hero[] = [];

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this.heroes.push({ name });
    this.logger.log(`Added hero: ${name}`);
  }

  remove(hero: Hero): void {
    this.heroes = this.heroes.filter((currentHero) => currentHero !== hero);
    this.logger.log(`Removed hero: ${hero.name}`);
  }
}
