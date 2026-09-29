import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hero } from '@app/models/hero';

import { HeroesListComponent } from './heroes-list.component';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesListComponent],
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
    const heroes: Hero[] = [{ name: 'Windstorm' }, { name: 'Bombasto' }];
    fixture.componentRef.setInput('heroes', heroes);
    fixture.detectChanges();

    const renderedHeroes = Array.from(
      nativeElement.querySelectorAll('.heroes li span'),
      (item) => item.textContent?.trim() ?? '',
    );
    const deleteButtons = Array.from(
      nativeElement.querySelectorAll<HTMLButtonElement>('.delete-button'),
      (button) => button.getAttribute('aria-label'),
    );

    expect(renderedHeroes).toEqual(['Windstorm', 'Bombasto']);
    expect(deleteButtons).toEqual(['Delete Windstorm', 'Delete Bombasto']);
  });

  it('should emit the selected hero when its delete button is clicked', () => {
    const windstorm: Hero = { name: 'Windstorm' };
    const bombasto: Hero = { name: 'Bombasto' };
    const emittedHeroes: Hero[] = [];
    component.deleteHero.subscribe((hero) => emittedHeroes.push(hero));
    fixture.componentRef.setInput('heroes', [windstorm, bombasto]);
    fixture.detectChanges();

    nativeElement.querySelector<HTMLButtonElement>('[aria-label="Delete Bombasto"]')?.click();

    expect(emittedHeroes).toEqual([bombasto]);
  });
});
