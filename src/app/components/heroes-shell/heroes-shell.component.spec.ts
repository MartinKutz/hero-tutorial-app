import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroService } from '@app/services/hero.service';
import type { Mock } from 'vitest';

import { HeroesShellComponent } from './heroes-shell.component';

describe('HeroesShellComponent', () => {
  let fixture: ComponentFixture<HeroesShellComponent>;
  let nativeElement: HTMLElement;
  let heroService: { loadHeroes: Mock };

  beforeEach(async () => {
    heroService = { loadHeroes: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HeroesShellComponent],
      providers: [provideRouter([]), { provide: HeroService, useValue: heroService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesShellComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load heroes on init', () => {
    expect(heroService.loadHeroes).toHaveBeenCalledOnce();
  });

  it('should render a router outlet', () => {
    expect(nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
