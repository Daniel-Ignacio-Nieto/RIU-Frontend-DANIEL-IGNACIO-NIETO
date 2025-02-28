import { Injectable } from '@angular/core';
import { Hero } from '../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesKey = 'heroes';

  constructor() {}

  private loadHeroes(): Hero[] {
    const heroes = localStorage.getItem(this.heroesKey);
    return heroes ? JSON.parse(heroes) : [];
  }

  private saveHeroes(heroes: Hero[]): void {
    localStorage.setItem(this.heroesKey, JSON.stringify(heroes));
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
    this.saveHeroes(heroes);
  }

  updateHero(updatedHero: Hero): void {
    const heroes = this.loadHeroes();
    const index = heroes.findIndex((h) => h.id === updatedHero.id);
    if (index !== -1) {
      heroes[index] = updatedHero;
      this.saveHeroes(heroes);
    }
  }

  deleteHero(id: number): void {
    const heroes = this.loadHeroes();
    const updatedHeroes = heroes.filter((h) => h.id !== id);
    this.saveHeroes(updatedHeroes);
  }
}
