import { Component, OnInit, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';
import { LoggingService } from '@app/services/logging.service';

@Component({
  selector: 'app-hero-details',
  imports: [RouterLink],
  templateUrl: './hero-details.component.html',
  styleUrl: './hero-details.component.scss',
})
export class HeroDetailsComponent implements OnInit {
  private readonly heroService = inject(HeroService);
  private readonly logger = inject(LoggingService);

  // Bound from the ":id" route parameter via withComponentInputBinding().
  readonly id = input.required({ transform: numberAttribute });
  readonly hero = signal<Hero | undefined>(undefined);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.heroService.getHero(this.id()).subscribe({
      next: (hero) => this.hero.set(hero),
      error: (error) => {
        const message = `Failed to load hero: ${error instanceof Error ? error.message : String(error)}`;
        this.errorMessage.set(message);
        this.logger.log(message);
        this.hero.set(undefined);
      },
    });
  }
}
