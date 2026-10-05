import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeroesShellComponent } from './heroes-shell.component';

describe('HeroesShellComponent', () => {
  let fixture: ComponentFixture<HeroesShellComponent>;
  let nativeElement: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesShellComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a router outlet', () => {
    expect(nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
