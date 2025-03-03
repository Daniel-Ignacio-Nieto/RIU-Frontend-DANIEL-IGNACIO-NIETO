import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { LoaderService } from './loader.service';
import { Hero } from '../models/hero.model';
import { SUPERHEROES } from '../mocks/super-heroes';

describe('HeroService', () => {
  let service: HeroService;
  let mockLoaderService: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    mockLoaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [{ provide: LoaderService, useValue: mockLoaderService }],
    });

    service = TestBed.inject(HeroService);
    localStorage.setItem('heroes', JSON.stringify(SUPERHEROES));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initializeHeroes() when there are no stored heroes', fakeAsync(() => {
    localStorage.clear();

    service.initializeHeroes();
    tick(1000);
    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(service.heroes$()).toEqual(SUPERHEROES);
  }));

  it('should return a hero by ID getHeroById()', () => {
    localStorage.clear();

    localStorage.setItem('heroes', JSON.stringify(SUPERHEROES));

    const hero = service.getHeroById(SUPERHEROES[0].id!);

    expect(hero).toEqual(SUPERHEROES[0]);
  });

  it('should add a new hero addHero()', fakeAsync(() => {
    localStorage.clear();
    const newHero: Hero = {
      id: 99,
      alias: 'Flash',
      name: 'Barry Allen',
      description: 'Velocidad extrema',
      powers: ['Super velocidad'],
      imgUrl: '',
    };

    service.addHero(newHero);

    expect(mockLoaderService.show).toHaveBeenCalled();
    tick(1000);
    expect(service.heroes$()).toEqual([newHero]);
    expect(mockLoaderService.hide).toHaveBeenCalled();
  }));

  it('should update() an existing hero', fakeAsync(() => {
    localStorage.clear();

    const heroToUpdate = { ...SUPERHEROES[0], name: 'Updated Name' };
    localStorage.setItem('heroes', JSON.stringify(SUPERHEROES));

    service.updateHero(heroToUpdate);
    tick(1000);
    const storedHeroes = JSON.parse(localStorage.getItem('heroes')!);
    expect(storedHeroes.find((h: Hero) => h.id === heroToUpdate.id)?.name).toBe('Updated Name');
  }));

  it('should delete() a hero', fakeAsync(() => {
    service.deleteHero(SUPERHEROES[0].id!);
    tick(1000);
    const storedHeroes = JSON.parse(localStorage.getItem('heroes')!);
    expect(storedHeroes.find((h: Hero) => h.id === SUPERHEROES[0].id)).toBeUndefined();
  }));

  it('should generateNewId()', () => {
    localStorage.clear();
    spyOn(localStorage, 'setItem');

    const newId = service.generateNewId();

    expect(localStorage.setItem).toHaveBeenCalledWith('lastHeroId', '52');
    expect(newId).toBe(52);
  });
});
