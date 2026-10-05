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
  private readonly heroService = inject(HeroService);
  private readonly logger = inject(LoggingService);

  readonly heroes = signal<Hero[]>([]);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe({
      next: (heroes) => {
        this.heroes.set(heroes);
        this.logger.log(`Loaded ${heroes.length} heroes`);
      },
      error: (err) => this.showError('Failed to load heroes', err),
    });
  }

  add(name: string): void {
    this.heroService.addHero(name).subscribe({
      next: (hero) => {
        this.heroes.update((heroes) => [...heroes, hero]);
        this.errorMessage.set(null);
        this.logger.log(`Added hero: ${hero.name}`);
      },
      error: (err) => this.showError('Failed to add hero', err),
    });
  }

  remove(hero: Hero): void {
    this.heroService.removeHero(hero).subscribe({
      next: () => {
        this.heroes.update((heroes) => heroes.filter((currentHero) => currentHero.id !== hero.id));
        this.errorMessage.set(null);
        this.logger.log(`Removed hero: ${hero.name}`);
      },
      error: (err) => this.showError('Failed to remove hero', err),
    });
  }

  private showError(action: string, error: unknown): void {
    const message = `${action}: ${error instanceof Error ? error.message : String(error)}`;
    this.errorMessage.set(message);
    this.logger.log(message);
  }
}
