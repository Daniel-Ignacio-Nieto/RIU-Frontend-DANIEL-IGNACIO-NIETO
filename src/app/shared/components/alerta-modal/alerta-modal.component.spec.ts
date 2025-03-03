import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaModalComponent } from './alerta-modal.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SUPERHEROES } from '../../mocks/super-heroes';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AlertaModalComponent', () => {
  let component: AlertaModalComponent;
  let fixture: ComponentFixture<AlertaModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AlertaModalComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AlertaModalComponent, MatInputModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: SUPERHEROES[0],
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertaModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be inject dataHero', () => {
    expect(component.data).toEqual(SUPERHEROES[0]);
  });

  it('should be close dialog to execute onNoClick()', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
