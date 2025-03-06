import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { Hero } from '../../models/hero.model';
import { SUPERHEROES } from '../../mocks/super-heroes';
import { HeroActions } from '../../interfaces/hero-action.interface';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let mockHero: Hero;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent, MatCardModule, MatChipsModule, MatProgressBarModule, MatButtonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;

    mockHero = SUPERHEROES[0];
    component.dataHero = mockHero;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a Hero like @Input()', () => {
    expect(component.dataHero).toBeDefined();
    expect(component.dataHero.alias).toBe(mockHero.alias);
  });

  it('should emit an @Output() action when calling handleAction()', () => {
    let spy1 = spyOn(component.action, 'emit');

    const action: HeroActions = { type: 'edit', heroe: mockHero };
    component.handleAction(action);

    expect(spy1).toHaveBeenCalledWith(action);
  });

  it('should set safe image when image fails to load', () => {
    const imgElement = document.createElement('img');
    imgElement.src = 'https://invalid-url.com/image.jpg';

    component.onImageError({ target: imgElement } as unknown as Event);

    expect(imgElement.src).toContain('assets/images/incognito-persona.jpg');
  });
});
