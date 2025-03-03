import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeroService } from './shared/services/hero.service';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  let mockHeroService: jasmine.SpyObj<HeroService>;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['initializeHeroes']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
    }).compileComponents();
  });

  it('should be create component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call initializeHeroes() when instantiated', () => {
    TestBed.createComponent(AppComponent);
    expect(mockHeroService.initializeHeroes).toHaveBeenCalled();
  });
});
