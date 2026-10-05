import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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
  let heroService: { getHeroes: Mock; addHero: Mock; removeHero: Mock };
  const logger = { log: vi.fn() };
  const mockHeroes: Hero[] = [
    { id: 11, name: 'Windstorm' },
    { id: 12, name: 'Bombasto' },
  ];

  beforeEach(async () => {
    heroService = {
      getHeroes: vi.fn().mockReturnValue(of(mockHeroes)),
      addHero: vi.fn().mockReturnValue(of({ id: 12, name: 'Magneta' })),
      removeHero: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [HeroesComponent],
      providers: [
        provideRouter([]),
        { provide: HeroService, useValue: heroService },
        { provide: LoggingService, useValue: logger },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heroes list', () => {
    expect(nativeElement.querySelector('app-heroes-list')?.textContent).toContain('Windstorm');
  });

  it('should load heroes from the backend on init', () => {
    expect(heroService.getHeroes).toHaveBeenCalledOnce();
  });

  it('should add the entered hero name and clear the input', () => {
    const updatedHeroes = [...mockHeroes, { id: 13, name: 'Magneta' }];
    heroService.getHeroes.mockReturnValue(of(updatedHeroes));
    const input = nativeElement.querySelector<HTMLInputElement>('#new-hero')!;
    input.value = 'Magneta';

    nativeElement.querySelector<HTMLButtonElement>('.add-button')?.click();

    expect(heroService.addHero).toHaveBeenCalledWith('Magneta');
    expect(input.value).toBe('');
    expect(heroService.getHeroes).toHaveBeenCalledTimes(2);
    fixture.detectChanges();
    expect(nativeElement.querySelector('app-heroes-list')?.textContent).toContain('Magneta');
  });

  it('should remove the hero after the backend confirms deletion', () => {
    heroService.getHeroes.mockReturnValue(of([mockHeroes[1]]));
    component.remove(mockHeroes[0]);

    expect(heroService.removeHero).toHaveBeenCalledWith(mockHeroes[0]);
    expect(heroService.getHeroes).toHaveBeenCalledTimes(2);
    fixture.detectChanges();
    expect(nativeElement.querySelector('app-heroes-list')?.textContent).not.toContain('Windstorm');
    expect(nativeElement.querySelector('app-heroes-list')?.textContent).toContain('Bombasto');
  });

  it('should show and log a failure when adding a hero fails', () => {
    const error = new Error('Server unavailable');
    heroService.addHero.mockReturnValue(throwError(() => error));

    component.add('Magneta');
    fixture.detectChanges();

    expect(nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Failed to add hero: Server unavailable',
    );
    expect(logger.log).toHaveBeenCalledWith('Failed to add hero: Server unavailable');
    expect(heroService.getHeroes).toHaveBeenCalledOnce();
  });
});
