import { Component, OnInit, inject, signal } from '@angular/core';
import { HeroesListComponent } from '@app/components/heroes-list/heroes-list.component';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';
import { LoggingService } from '@app/services/logging.service';

@Component({
  selector: 'app-heroes',
  imports: [HeroesListComponent],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent implements OnInit {
  private readonly logger = inject(LoggingService);
  private readonly heroService = inject(HeroService);

  readonly heroes = signal<Hero[]>([]);

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe({
      next: (heroes) => {
        this.heroes.set(heroes);
        this.logger.log(`Loaded ${heroes.length} heroes`);
      },
      error: (err) => {
        this.logger.log(`Failed to load heroes: ${err}`);
      },
    });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this.heroes.update((heroes) => [...heroes, { name }]);
    this.logger.log(`Added hero: ${name}`);
  }

  remove(hero: Hero): void {
    this.heroes.update((heroes) => heroes.filter((currentHero) => currentHero !== hero));
    this.logger.log(`Removed hero: ${hero.name}`);
  }
}
