import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroService } from '@app/services/hero.service';

@Component({
  selector: 'app-hero-details',
  imports: [RouterLink],
  templateUrl: './hero-details.component.html',
  styleUrl: './hero-details.component.scss',
})
export class HeroDetailsComponent {
  private readonly heroService = inject(HeroService);

  // Bound from the ":id" route parameter via withComponentInputBinding().
  readonly id = input.required({ transform: numberAttribute });

  readonly hero = computed(() => this.heroService.heroes().find((hero) => hero.id === this.id()));
}
