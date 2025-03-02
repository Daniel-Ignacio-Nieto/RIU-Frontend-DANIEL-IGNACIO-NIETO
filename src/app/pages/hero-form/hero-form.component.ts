import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HeroService } from '../../shared/services/hero.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Hero } from '../../shared/models/hero.model';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly heroService = inject(HeroService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public heroForm!: FormGroup;
  public heroId: number | null = null;

  ngOnInit(): void {
    this.initForm();
    this.isEdit();
  }

  private initForm(): void {
    this.heroForm = this.fb.group({
      alias: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      description: [null, [Validators.minLength(10), Validators.maxLength(200), Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-]+$/)]],
      powers: [null, [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ,\s]*$/)]],
      imgUrl: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;%=]*)?$/),
        ],
      ],
    });
  }

  private isEdit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.heroId = Number(params['id']);
        this.loadHeroData(this.heroId);
      }
    });
  }

  private loadHeroData(id: number): void {
    const hero = this.heroService.getHeroById(id);
    if (hero) {
      this.heroForm.patchValue(hero);
    }
  }

  public saveHero(): void {
    if (this.heroForm.invalid) return;

    const { name, alias, description, powers, imgUrl } = this.heroForm.value;

    const heroData: Hero = {
      id: this.heroId ?? this.heroService.generateNewId(),
      name,
      alias,
      description,
      powers: this.formatPowers(powers),
      imgUrl,
    };

    this.heroId ? this.heroService.updateHero(heroData) : this.heroService.addHero(heroData);

    this.router.navigate(['/heroes']);
  }

  private formatPowers(powers: string): string[] {
    return powers
      ? powers
          .split(',')
          .map((power: string) => power.trim())
          .filter((power: string) => power.length > 0)
      : [];
  }
}
