import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Hero } from '@app/models/hero';
import { LoggingService } from '@app/services/logging.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggingService);
  private readonly heroesUrl = 'api/heroes';
  private readonly heroesState = signal<Hero[]>([]);

  readonly heroes = this.heroesState.asReadonly();

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  loadHeroes(): void {
    this.getHeroes().subscribe({
      next: (heroes) => {
        this.heroesState.set(heroes);
        this.logger.log(`Loaded ${heroes.length} heroes`);
      },
      error: (err) => {
        this.logger.log(`Failed to load heroes: ${err}`);
      },
    });
  }

  addHero(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this.heroesState.update((heroes) => [...heroes, { id: this.nextId(heroes), name }]);
    this.logger.log(`Added hero: ${name}`);
  }

  removeHero(hero: Hero): void {
    this.heroesState.update((heroes) => heroes.filter((currentHero) => currentHero.id !== hero.id));
    this.logger.log(`Removed hero: ${hero.name}`);
  }

  private nextId(heroes: Hero[]): number {
    return heroes.reduce((maxId, hero) => Math.max(maxId, hero.id), 0) + 1;
  }
}
