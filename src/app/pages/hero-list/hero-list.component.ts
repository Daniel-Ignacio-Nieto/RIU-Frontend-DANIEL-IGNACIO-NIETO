import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { HeroService } from '../../shared/services/hero.service';
import { Hero } from '../../shared/models/hero.model';
import { HeroActions } from '../../shared/interfaces/hero-action.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [CommonModule, HeroComponent, MatButtonModule],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  heroes$!: Observable<Hero[]>;

  constructor(
    private heroService: HeroService,
    private router: Router
  ) {
    this.heroes$ = this.heroService.heroes$;
  }

  ngOnInit(): void {}

  addHero(): void {
    this.router.navigate(['/heroes/form']);
  }

  editHero(id: number): void {
    console.log('paso por el edit');
    this.router.navigate(['/heroes/form'], { queryParams: { id } });
  }

  deleteHero(id: number): void {
    console.log('paso por el delete');
    this.heroService.deleteHero(id);
  }

  handleHeroAction(event: HeroActions) {
    switch (event.type) {
      case 'edit':
        this.editHero(event.id);
        break;
      case 'delete':
        this.deleteHero(event.id);
        break;
      default:
        break;
    }
  }
}
