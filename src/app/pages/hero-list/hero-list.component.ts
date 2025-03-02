import { Component, computed, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { HeroService } from '../../shared/services/hero.service';
import { Hero } from '../../shared/models/hero.model';
import { HeroActions } from '../../shared/interfaces/hero-action.interface';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { AlertaModalComponent } from '../../shared/components/alerta-modal/alerta-modal.component';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [CommonModule, HeroComponent, MatButtonModule, MatPaginatorModule],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  public readonly heroes$!: Signal<Hero[]>;
  public pageIndex = signal<number>(0);
  public pageSize = signal<number>(10);
  public searchTerm = signal<string>('');

  constructor(
    private readonly heroService: HeroService,
    private readonly router: Router,
    private readonly dialog: MatDialog
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

  deleteHero(heroe: Hero): void {
    const dialogRef = this.dialog.open(AlertaModalComponent, {
      data: { alias: heroe.alias },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result !== undefined) {
        this.heroService.deleteHero(heroe.id!);
      }
    });
  }

  handleHeroAction(event: HeroActions) {
    switch (event.type) {
      case 'edit':
        this.editHero(event.heroe.id!);
        break;
      case 'delete':
        this.deleteHero(event.heroe);
        break;
      default:
        break;
    }
  }

  paginatedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredHeroes().slice(start, end);
  });

  handlePageEvent(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  filteredHeroes = computed(() => this.heroes$().filter((hero) => hero.alias!.toLowerCase().includes(this.searchTerm().toLowerCase())));

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.pageIndex.set(0);
  }
}
