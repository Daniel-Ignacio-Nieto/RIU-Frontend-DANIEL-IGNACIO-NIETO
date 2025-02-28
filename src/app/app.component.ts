import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroService } from './shared/services/hero.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'super-heroes';

  constructor(private heroService: HeroService) {
    this.heroService.initializeHeroes();
  }
}
