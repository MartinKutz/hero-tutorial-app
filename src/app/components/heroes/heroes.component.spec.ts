import { WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';
import type { Mock } from 'vitest';

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let nativeElement: HTMLElement;
  let heroService: { heroes: WritableSignal<Hero[]>; addHero: Mock };

  beforeEach(async () => {
    heroService = { heroes: signal([{ id: 11, name: 'Windstorm' }]), addHero: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HeroesComponent],
      providers: [provideRouter([]), { provide: HeroService, useValue: heroService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heroes list', () => {
    expect(nativeElement.querySelector('app-heroes-list')?.textContent).toContain('Windstorm');
  });

  it('should add the entered hero name and clear the input', () => {
    const input = nativeElement.querySelector<HTMLInputElement>('#new-hero')!;
    input.value = 'Magneta';

    nativeElement.querySelector<HTMLButtonElement>('.add-button')?.click();

    expect(heroService.addHero).toHaveBeenCalledWith('Magneta');
    expect(input.value).toBe('');
  });
});
