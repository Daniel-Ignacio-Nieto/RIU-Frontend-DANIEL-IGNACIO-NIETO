import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';
import { HeroService } from '../../shared/services/hero.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { AlertaModalComponent } from '../../shared/components/alerta-modal/alerta-modal.component';
import { of } from 'rxjs';
import { Hero } from '../../shared/models/hero.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SUPERHEROES } from '../../shared/mocks/super-heroes';
import { signal } from '@angular/core';
import { HeroActions } from '../../shared/interfaces/hero-action.interface';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockHeroes: Hero[] = SUPERHEROES;
  const mockHeroesSignal = signal(mockHeroes);

  beforeEach(async () => {
    mockHeroService = {
      ...jasmine.createSpyObj('HeroService', ['deleteHero']),
      heroes$: mockHeroesSignal,
    };
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HeroListComponent, HeroComponent, AlertaModalComponent, MatButtonModule, MatPaginatorModule, NoopAnimationsModule],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /heroes/form when addHero() is called', () => {
    component.addHero();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/form']);
  });

  it('should navigate to /heroes/form with queryParams when editHero is called', () => {
    const heroId = 1;
    component.editHero(heroId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/form'], { queryParams: { id: heroId } });
  });

  it('should call editHero() when handleHeroAction() is called with type edit', () => {
    const event: HeroActions = { type: 'edit', heroe: mockHeroes[0] };
    spyOn(component, 'editHero');

    component.handleHeroAction(event);

    expect(component.editHero).toHaveBeenCalledWith(mockHeroes[0].id!);
  });

  it('should call deleteHero when handleHeroAction is called with type delete', () => {
    const event: HeroActions = { type: 'delete', heroe: mockHeroes[0] };
    spyOn(component, 'deleteHero');

    component.handleHeroAction(event);

    expect(component.deleteHero).toHaveBeenCalledWith(mockHeroes[0]);
  });

  it('should open dialog and call deleteHero() on service when modal is confirmed', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.deleteHero(mockHeroes[0]);

    expect(mockDialog.open).toHaveBeenCalledWith(AlertaModalComponent, { data: { alias: mockHeroes[0].alias } });
    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(mockHeroes[0].id!);
  });

  it('should update pageIndex and pageSize when handlePageEvent() is called', () => {
    const mockEvent: PageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    component.handlePageEvent(mockEvent);

    expect(component.pageIndex()).toBe(mockEvent.pageIndex);
    expect(component.pageSize()).toBe(mockEvent.pageSize);
  });

  it('should update searchTerm and reset pageIndex when onSearch() is called', () => {
    const mockEvent = { target: { value: 'bat' } } as unknown as Event;
    component.onSearch(mockEvent);

    expect(component.searchTerm()).toBe('bat');
    expect(component.pageIndex()).toBe(0);
  });
});
