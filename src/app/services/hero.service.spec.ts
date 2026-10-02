import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Hero } from '@app/models/hero';
import { LoggingService } from '@app/services/logging.service';
import type { Mock } from 'vitest';

import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;
  let httpTesting: HttpTestingController;
  let logger: { log: Mock };

  const mockHeroes: Hero[] = [
    { id: 11, name: 'Windstorm', classification: 'PUBLIC' },
    { id: 12, name: 'Bombasto', classification: 'CLASSIFIED' },
  ];

  beforeEach(() => {
    logger = { log: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoggingService, useValue: logger },
      ],
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

  it('should propagate HTTP errors', () => {
    let error: unknown;

    service.getHeroes().subscribe({ error: (err) => (error = err) });

    httpTesting
      .expectOne('api/heroes')
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(error).toBeTruthy();
  });

  it('should store and log the loaded heroes', () => {
    service.loadHeroes();
    httpTesting.expectOne('api/heroes').flush(mockHeroes);

    expect(service.heroes()).toEqual(mockHeroes);
    expect(logger.log).toHaveBeenCalledWith('Loaded 2 heroes');
  });

  it('should keep an empty list and log when loading fails', () => {
    service.loadHeroes();
    httpTesting
      .expectOne('api/heroes')
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(service.heroes()).toEqual([]);
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Failed to load heroes'));
  });

  it('should add a hero with an id that does not exist yet', () => {
    service.loadHeroes();
    httpTesting.expectOne('api/heroes').flush(mockHeroes);

    service.addHero('Magneta');

    expect(service.heroes().at(-1)).toEqual({ id: 13, name: 'Magneta' });
    expect(logger.log).toHaveBeenCalledWith('Added hero: Magneta');
  });

  it('should assign id 1 when the list is empty', () => {
    service.addHero('Magneta');

    expect(service.heroes()).toEqual([{ id: 1, name: 'Magneta' }]);
  });

  it('should trim whitespace from hero names', () => {
    service.addHero('  Magneta  ');

    expect(service.heroes()).toEqual([{ id: 1, name: 'Magneta' }]);
  });

  it('should ignore empty or whitespace-only names', () => {
    service.addHero('   ');

    expect(service.heroes()).toEqual([]);
    expect(logger.log).not.toHaveBeenCalled();
  });

  it('should remove a hero by id and log it', () => {
    service.loadHeroes();
    httpTesting.expectOne('api/heroes').flush(mockHeroes);

    service.removeHero({ ...mockHeroes[0] });

    expect(service.heroes()).toEqual([mockHeroes[1]]);
    expect(logger.log).toHaveBeenCalledWith('Removed hero: Windstorm');
  });
});
