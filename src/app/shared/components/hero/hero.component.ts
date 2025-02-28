import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Hero } from '../../models/hero.model';
import { HeroActions } from '../../interfaces/hero-action.interface';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  @Input() dataHero!: Hero;
  @Output() action = new EventEmitter<HeroActions>();

  public handleAction(dataType: HeroActions): void {
    this.action.emit(dataType);
  }
}
