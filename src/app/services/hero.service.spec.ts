import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Hero } from '@app/models/hero';

import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;
  let httpTesting: HttpTestingController;

  const mockHeroes: Hero[] = [
    { id: 11, name: 'Windstorm', classification: 'PUBLIC' },
    { id: 12, name: 'Bombasto', classification: 'CLASSIFIED' },
  ];

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
    let result: Hero[] | undefined;

    service.getHeroes().subscribe((heroes) => (result = heroes));

    const req = httpTesting.expectOne('api/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);

    expect(result).toEqual(mockHeroes);
  });

  it('should GET a hero by id', () => {
    let result: Hero | undefined;

    service.getHero(11).subscribe((hero) => (result = hero));

    const req = httpTesting.expectOne('api/heroes/11');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes[0]);

    expect(result).toEqual(mockHeroes[0]);
  });

  it('should propagate HTTP errors', () => {
    let error: unknown;

    service.getHeroes().subscribe({ error: (err) => (error = err) });

    httpTesting
      .expectOne('api/heroes')
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(error).toBeTruthy();
  });

  it('should POST a hero and return the backend response', () => {
    let result: Hero | undefined;
    service.addHero(' Magneta ').subscribe((hero) => (result = hero));

    const req = httpTesting.expectOne('api/heroes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Magneta' });
    req.flush({ id: 13, name: 'Magneta' });

    expect(result).toEqual({ id: 13, name: 'Magneta' });
  });

  it('should not send a POST for an empty name', () => {
    service.addHero('   ').subscribe();

    httpTesting.expectNone('api/heroes');
  });

  it('should PUT an updated hero', () => {
    const updatedHero = { ...mockHeroes[0], name: 'Windstorm II' };

    service.updateHero(updatedHero).subscribe();

    const req = httpTesting.expectOne('api/heroes/11');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedHero);
    req.flush(updatedHero);
  });

  it('should DELETE a hero by id', () => {
    service.removeHero({ ...mockHeroes[0] }).subscribe();

    const req = httpTesting.expectOne('api/heroes/11');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
