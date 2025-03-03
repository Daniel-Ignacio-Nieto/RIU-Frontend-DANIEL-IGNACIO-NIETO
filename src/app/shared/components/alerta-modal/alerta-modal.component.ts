import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Hero } from '../../models/hero.model';

@Component({
  selector: 'app-alerta-modal',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './alerta-modal.component.html',
  styleUrl: './alerta-modal.component.scss',
})
export class AlertaModalComponent {
  readonly dialogRef = inject(MatDialogRef<AlertaModalComponent>);
  readonly data = inject<Hero>(MAT_DIALOG_DATA);
  readonly accept = signal(true);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
