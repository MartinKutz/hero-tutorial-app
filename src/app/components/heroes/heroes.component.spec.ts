import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';
import { LoggingService } from '@app/services/logging.service';
import { of, throwError } from 'rxjs';
import type { Mock } from 'vitest';

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let nativeElement: HTMLElement;

  const mockHeroes: Hero[] = [
    { id: 11, name: 'Windstorm', classification: 'PUBLIC' },
    { id: 12, name: 'Bombasto', classification: 'CLASSIFIED' },
  ];
  let heroService: { getHeroes: Mock };
  let logger: { log: Mock };

  beforeEach(async () => {
    heroService = { getHeroes: vi.fn() };
    heroService.getHeroes.mockReturnValue(of(mockHeroes));
    logger = { log: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HeroesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HeroService, useValue: heroService },
        { provide: LoggingService, useValue: logger },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should delete a hero when its delete button is clicked', async () => {
    await fixture.whenStable();
    component.heroes.set([...mockHeroes]);
    fixture.detectChanges();

    nativeElement.querySelector<HTMLButtonElement>('.delete-button')?.click();

    expect(component.heroes()).toEqual([mockHeroes[1]]);
  });

  it('should remove the selected hero and keep the others', async () => {
    await fixture.whenStable();
    component.remove(mockHeroes[0]);

    expect(component.heroes()).toEqual([mockHeroes[1]]);
  });

  it('should add a hero', async () => {
    await fixture.whenStable();
    component.add('Magneta');

    expect(component.heroes().map((hero) => hero.name)).include('Magneta');
  });

  it('should assign a new hero an id that does not exist yet', async () => {
    await fixture.whenStable();
    component.add('Magneta');

    const ids = component.heroes().map((hero) => hero.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(component.heroes().at(-1)).toEqual({ id: 13, name: 'Magneta' });
  });

  it('should assign id 1 when the list is empty', async () => {
    await fixture.whenStable();
    component.heroes.set([]);

    component.add('Magneta');

    expect(component.heroes()).toEqual([{ id: 1, name: 'Magneta' }]);
  });

  it('should trim whitespace from hero names', async () => {
    await fixture.whenStable();
    component.add('  Magneta  ');

    expect(component.heroes().map((hero) => hero.name)).contains('Magneta');
  });

  it('should ignore empty or whitespace-only names', async () => {
    await fixture.whenStable();
    component.add('   ');

    expect(component.heroes()).toEqual(mockHeroes);
  });

  it('should load heroes from the service on init', async () => {
    await fixture.whenStable();

    expect(heroService.getHeroes).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.heroes()).toEqual(mockHeroes);
  });

  it('should render the loaded heroes', async () => {
    await fixture.whenStable();

    const renderedHeroes = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.heroes li span'),
      (item) => item.textContent?.trim() ?? '',
    );
    expect(renderedHeroes).toEqual(mockHeroes.map((hero) => hero.name));
  });

  it('should keep an empty list and log when loading fails', async () => {
    heroService.getHeroes.mockReturnValue(throwError(() => 'Server error'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.heroes()).toEqual([]);
    expect(logger.log).toHaveBeenCalledWith('Failed to load heroes: Server error');
  });
});
