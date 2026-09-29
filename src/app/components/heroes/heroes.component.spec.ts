import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render each hero in the list', () => {
    component.heroes = [{ name: 'Windstorm' }, { name: 'Bombasto' }];
    fixture.detectChanges();

    const renderedHeroes = Array.from(
      nativeElement.querySelectorAll('.heroes li'),
      (item) => item.textContent?.trim() ?? '',
    );

    expect(renderedHeroes).toEqual(['Windstorm', 'Bombasto']);
  });

  it('should add a hero', () => {
    component.add('Windstorm');

    expect(component.heroes).toEqual([{ name: 'Windstorm' }]);
  });

  it('should trim whitespace from hero names', () => {
    component.add('  Windstorm  ');

    expect(component.heroes).toEqual([{ name: 'Windstorm' }]);
  });

  it('should ignore empty or whitespace-only names', () => {
    component.add('   ');

    expect(component.heroes).toEqual([]);
  });
});
