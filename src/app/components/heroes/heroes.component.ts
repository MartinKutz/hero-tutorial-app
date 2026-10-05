import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { HeroesListComponent } from '@app/components/heroes-list/heroes-list.component';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';
import { LoggingService } from '@app/services/logging.service';
import { Subject, catchError, of, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-heroes',
  imports: [AsyncPipe, HeroesListComponent],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent {
  private readonly heroService = inject(HeroService);
  private readonly logger = inject(LoggingService);
  private readonly refreshHeroes = new Subject<void>();

  readonly errorMessage = signal<string | null>(null);
  readonly heroes$ = this.refreshHeroes.pipe(
    startWith(undefined),
    switchMap(() =>
      this.heroService.getHeroes().pipe(
        tap({
          next: (heroes) => {
            this.errorMessage.set(null);
            this.logger.log(`Loaded ${heroes.length} heroes`);
          },
          error: (err) => this.showError('Failed to load heroes', err),
        }),
        catchError(() => of([])),
      ),
    ),
  );

  add(name: string): void {
    this.heroService.addHero(name).subscribe({
      next: (hero) => {
        this.errorMessage.set(null);
        this.logger.log(`Added hero: ${hero.name}`);
        this.refreshHeroes.next();
      },
      error: (err) => this.showError('Failed to add hero', err),
    });
  }

  remove(hero: Hero): void {
    this.heroService.removeHero(hero).subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.logger.log(`Removed hero: ${hero.name}`);
        this.refreshHeroes.next();
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
