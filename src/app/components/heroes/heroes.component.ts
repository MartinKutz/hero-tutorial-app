import { Component, inject } from '@angular/core';
import { HeroesListComponent } from '@app/components/heroes-list/heroes-list.component';
import { HeroService } from '@app/services/hero.service';

@Component({
  selector: 'app-heroes',
  imports: [HeroesListComponent],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent {
  private readonly heroService = inject(HeroService);

  add(name: string): void {
    this.heroService.addHero(name);
  }
}
