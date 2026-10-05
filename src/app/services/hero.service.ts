import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Hero } from '@app/models/hero';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly heroesUrl = 'api/heroes';

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`);
  }

  addHero(name: string): Observable<Hero> {
    name = name.trim();
    if (!name) {
      return EMPTY;
    }

    return this.http.post<Hero>(this.heroesUrl, { name });
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.heroesUrl}/${hero.id}`, hero);
  }

  removeHero(hero: Hero): Observable<void> {
    return this.http.delete<void>(`${this.heroesUrl}/${hero.id}`);
  }
}
