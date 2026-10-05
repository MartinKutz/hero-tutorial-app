import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Hero } from '@app/models/hero';

import { HeroesListComponent } from './heroes-list.component';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let nativeElement: HTMLElement;

  const windstorm: Hero = { id: 11, name: 'Windstorm', classification: 'PUBLIC' };
  const bombasto: Hero = { id: 12, name: 'Bombasto', classification: 'CLASSIFIED' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesListComponent],
      providers: [provideRouter([])],
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
    fixture.componentRef.setInput('heroes', [windstorm, bombasto]);
    fixture.detectChanges();

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
    fixture.componentRef.setInput('heroes', [windstorm, bombasto]);
    fixture.detectChanges();

    const links = Array.from(nativeElement.querySelectorAll('.heroes li a'), (link) =>
      link.getAttribute('href'),
    );

    expect(links).toEqual(['/heroes/11', '/heroes/12']);
  });

  it('should emit the selected hero when its delete button is clicked', () => {
    const deletedHeroes: Hero[] = [];
    component.deleteHero.subscribe((hero) => deletedHeroes.push(hero));
    fixture.componentRef.setInput('heroes', [windstorm, bombasto]);
    fixture.detectChanges();

    nativeElement.querySelector<HTMLButtonElement>('[aria-label="Delete Bombasto"]')?.click();

    expect(deletedHeroes).toEqual([bombasto]);
  });
});
