import { WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';
import type { Mock } from 'vitest';

import { HeroesListComponent } from './heroes-list.component';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let nativeElement: HTMLElement;
  let heroService: { heroes: WritableSignal<Hero[]>; removeHero: Mock };

  const windstorm: Hero = { id: 11, name: 'Windstorm', classification: 'PUBLIC' };
  const bombasto: Hero = { id: 12, name: 'Bombasto', classification: 'CLASSIFIED' };

  beforeEach(async () => {
    heroService = { heroes: signal([windstorm, bombasto]), removeHero: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HeroesListComponent],
      providers: [provideRouter([]), { provide: HeroService, useValue: heroService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero names and accessible delete buttons', () => {
    const renderedHeroes = Array.from(
      nativeElement.querySelectorAll('.heroes li a'),
      (item) => item.textContent?.trim() ?? '',
    );
    const deleteButtons = Array.from(
      nativeElement.querySelectorAll<HTMLButtonElement>('.delete-button'),
      (button) => button.getAttribute('aria-label'),
    );

    expect(renderedHeroes).toEqual(['Windstorm', 'Bombasto']);
    expect(deleteButtons).toEqual(['Delete Windstorm', 'Delete Bombasto']);
  });

  it('should link each hero name to its details page', () => {
    const links = Array.from(nativeElement.querySelectorAll('.heroes li a'), (link) =>
      link.getAttribute('href'),
    );

    expect(links).toEqual(['/heroes/11', '/heroes/12']);
  });

  it('should remove the selected hero when its delete button is clicked', () => {
    nativeElement.querySelector<HTMLButtonElement>('[aria-label="Delete Bombasto"]')?.click();

    expect(heroService.removeHero).toHaveBeenCalledWith(bombasto);
  });
});
