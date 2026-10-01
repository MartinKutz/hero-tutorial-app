import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Hero } from '@app/models/hero';

import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HeroService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET heroes from api/heroes', () => {
    const mockHeroes: Hero[] = [
      { id: 11, name: 'Windstorm', classification: 'PUBLIC' },
      { id: 12, name: 'Bombasto', classification: 'CLASSIFIED' },
    ];
    let result: Hero[] | undefined;

    service.getHeroes().subscribe((heroes) => (result = heroes));

    const req = httpTesting.expectOne('api/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);

    expect(result).toEqual(mockHeroes);
  });

  it('should propagate HTTP errors', () => {
    let error: unknown;

    service.getHeroes().subscribe({ error: (err) => (error = err) });

    httpTesting
      .expectOne('api/heroes')
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(error).toBeTruthy();
  });
});
