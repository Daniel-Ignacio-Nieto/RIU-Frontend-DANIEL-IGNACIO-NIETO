import { Hero } from '../models/hero.model';

export interface HeroActions {
  type: 'edit' | 'delete';
  heroe: Hero;
}
