import { inject, Injectable, signal } from '@angular/core';
import { Hero } from '../models/hero.model';
import { SUPERHEROES } from '../mocks/super-heroes';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly loaderService = inject(LoaderService);

  private heroesKey = 'heroes';
  public heroes$ = signal<Hero[]>(this.loadHeroes());

  // Tambien se puede hacer de esta otra forma para compartir el estado global:
  // private heroesSubject = new BehaviorSubject<Hero[]>(this.loadHeroes());
  // public heroes$ = this.heroesSubject.asObservable();

  public initializeHeroes() {
    const storedHeroes = this.loadHeroes();
    if (storedHeroes.length === 0) {
      this.updateStorageAndNotify(SUPERHEROES);
    }
  }

  private updateStorageAndNotify(heroes: Hero[]) {
    this.loaderService.show();

    setTimeout(() => {
      localStorage.setItem(this.heroesKey, JSON.stringify(heroes));
      this.heroes$.set(heroes);
      this.loaderService.hide();
    }, 2000);
  }

  private loadHeroes(): Hero[] {
    const heroes = localStorage.getItem(this.heroesKey);
    return heroes ? JSON.parse(heroes) : [];
  }

  getHeroById(id: number): Hero | undefined {
    return this.getHeroes().find((hero) => hero.id === id);
  }

  getHeroes(): Hero[] {
    return this.loadHeroes();
  }

  addHero(hero: Hero): void {
    const heroes = this.loadHeroes();
    heroes.push(hero);
    this.updateStorageAndNotify(heroes);
  }

  updateHero(updatedHero: Hero): void {
    const heroes = this.loadHeroes();
    const index = heroes.findIndex((h) => h.id === updatedHero.id);
    if (index !== -1) {
      heroes[index] = updatedHero;
      this.updateStorageAndNotify(heroes);
    }
  }

  deleteHero(id: number): void {
    const heroes = this.loadHeroes();
    const updatedHeroes = heroes.filter((h) => h.id !== id);
    this.updateStorageAndNotify(updatedHeroes);
  }

  generateNewId(): number {
    let lastId = Number(localStorage.getItem('lastHeroId')) || 51;
    lastId++;

    localStorage.setItem('lastHeroId', lastId.toString());

    return lastId;
  }
}
