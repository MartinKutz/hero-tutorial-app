import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroService } from '@app/services/hero.service';

@Component({
  selector: 'app-heroes-shell',
  imports: [RouterOutlet],
  templateUrl: './heroes-shell.component.html',
})
export class HeroesShellComponent implements OnInit {
  private readonly heroService = inject(HeroService);

  ngOnInit(): void {
    this.heroService.loadHeroes();
  }
}
