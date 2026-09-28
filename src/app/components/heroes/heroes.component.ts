import { Component } from '@angular/core';

@Component({
  selector: 'app-heroes',
  imports: [],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent {
  heroes: string[] = [];

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this.heroes.push(name);
  }
}
