import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Hero } from '@app/models/hero';
import { HeroService } from '@app/services/hero.service';
import { LoggingService } from '@app/services/logging.service';
import { of, throwError } from 'rxjs';
import type { Mock } from 'vitest';

import { HeroDetailsComponent } from './hero-details.component';

describe('HeroDetailsComponent', () => {
  let fixture: ComponentFixture<HeroDetailsComponent>;
  let nativeElement: HTMLElement;
  const windstorm: Hero = { id: 11, name: 'Windstorm', classification: 'PUBLIC' };
  const bombasto: Hero = {
    id: 12,
    name: 'Bombasto',
    classification: 'CLASSIFIED',
    description: 'Explosive',
  };
  let heroService: { getHero: Mock };

  beforeEach(async () => {
    heroService = { getHero: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HeroDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: HeroService, useValue: heroService },
        { provide: LoggingService, useValue: { log: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailsComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should show the details of the hero returned by the backend', async () => {
    heroService.getHero.mockReturnValue(of(bombasto));
    fixture.componentRef.setInput('id', '12');
    fixture.detectChanges();
    await fixture.whenStable();

    const values = Array.from(nativeElement.querySelectorAll('dd'), (dd) => dd.textContent?.trim());
    expect(heroService.getHero).toHaveBeenCalledWith(12);
    expect(nativeElement.querySelector('h3')?.textContent).toContain('Bombasto');
    expect(values).toEqual(['12', 'Bombasto', 'CLASSIFIED', 'Explosive']);
  });

  it('should show a message when the backend cannot find the hero', async () => {
    heroService.getHero.mockReturnValue(throwError(() => new Error('Not found')));
    fixture.componentRef.setInput('id', '99');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Failed to load hero: Not found',
    );
  });

  it('should link back to the list', async () => {
    heroService.getHero.mockReturnValue(of(windstorm));
    fixture.componentRef.setInput('id', '11');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(nativeElement.querySelector('.back-link')?.getAttribute('href')).toBe('/');
  });
});
