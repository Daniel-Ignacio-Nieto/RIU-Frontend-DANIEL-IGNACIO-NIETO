import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestroyRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HeroFormComponent } from './hero-form.component';
import { HeroService } from '../../shared/services/hero.service';
import { Hero } from '../../shared/models/hero.model';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockDestroyRef: DestroyRef;
  let mockActivatedRoute: any;

  const mockHero: Hero = {
    id: 1,
    alias: 'Batman',
    name: 'Bruce Wayne',
    description: 'Detective y millonario',
    powers: ['Investigación', 'Artes marciales'],
    imgUrl: 'https://example.com/batman.jpg',
  };

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['generateNewId', 'getHeroById', 'addHero', 'updateHero']);
    mockDestroyRef = {} as DestroyRef;
    mockActivatedRoute = {
      queryParams: of({}),
    };

    mockHeroService.getHeroById.and.returnValue(mockHero);
    mockHeroService.generateNewId.and.returnValue(51);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HeroFormComponent,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: HeroService, useValue: mockHeroService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute as ActivatedRoute },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    mockActivatedRoute.queryParams = of({ id: '1' });
    expect(component).toBeTruthy();
  });

  it('should create Form when ngOnInit() starts', () => {
    mockActivatedRoute.queryParams = of({ id: '1' });
    component.ngOnInit();

    expect(component.heroForm).toBeDefined();
    expect(component.heroForm.controls['alias']).toBeDefined();
    expect(component.heroForm.controls['name']).toBeDefined();
  });

  it('should call service updateHero() when execute saveHero()', () => {
    mockActivatedRoute.queryParams = of({ id: '1' });
    component.ngOnInit();
    component.saveHero();
    expect(mockHeroService.updateHero).toHaveBeenCalled();
  });

  it('should not load hero data when id is not provided in queryParams', () => {
    component.ngOnInit();

    expect(component.heroId).toBeNull();
    expect(mockHeroService.getHeroById).not.toHaveBeenCalled();
  });

  it('should not save hero when form is invalid', () => {
    component.heroForm.setValue({
      alias: '',
      name: '',
      description: '',
      powers: '',
      imgUrl: '',
    });

    component.saveHero();

    expect(mockHeroService.addHero).not.toHaveBeenCalled();
    expect(mockHeroService.generateNewId).not.toHaveBeenCalled();
  });

  it('should save a new hero when form is valid', () => {
    component.heroForm.setValue({
      alias: 'Spiderman',
      name: 'Peter Parker',
      description: 'Un superhéroe arácnido',
      powers: 'Trepar paredes, Sentido arácnido',
      imgUrl: 'https://www.example.com/spiderman.jpg',
    });

    component.saveHero();

    expect(mockHeroService.generateNewId).toHaveBeenCalled();
    expect(mockHeroService.addHero).toHaveBeenCalledWith({
      id: 51,
      alias: 'Spiderman',
      name: 'Peter Parker',
      description: 'Un superhéroe arácnido',
      powers: ['Trepar paredes', 'Sentido arácnido'],
      imgUrl: 'https://www.example.com/spiderman.jpg',
    });
  });
});
