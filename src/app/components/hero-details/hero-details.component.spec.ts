import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';

import { HeroDetailsComponent } from './hero-details.component';

describe('HeroDetailsComponent', () => {
  let fixture: ComponentFixture<HeroDetailsComponent>;
  let nativeElement: HTMLElement;
  const heroes = signal<Hero[]>([
    { id: 11, name: 'Windstorm', classification: 'PUBLIC' },
    { id: 12, name: 'Bombasto', classification: 'CLASSIFIED', description: 'Explosive' },
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetailsComponent],
      providers: [provideRouter([]), { provide: HeroService, useValue: { heroes } }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailsComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should show the details of the hero with the given id', async () => {
    fixture.componentRef.setInput('id', '12');
    await fixture.whenStable();

    const values = Array.from(nativeElement.querySelectorAll('dd'), (dd) => dd.textContent?.trim());
    expect(nativeElement.querySelector('h3')?.textContent).toContain('Bombasto');
    expect(values).toEqual(['12', 'Bombasto', 'CLASSIFIED', 'Explosive']);
  });

  it('should show a message when the hero does not exist', async () => {
    fixture.componentRef.setInput('id', '99');
    await fixture.whenStable();

    expect(nativeElement.querySelector('.not-found')?.textContent).toContain('Hero not found');
  });

  it('should link back to the list', async () => {
    fixture.componentRef.setInput('id', '11');
    await fixture.whenStable();

    expect(nativeElement.querySelector('.back-link')?.getAttribute('href')).toBe('/');
  });
});
