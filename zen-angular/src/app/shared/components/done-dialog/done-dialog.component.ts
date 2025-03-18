import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-done-dialog',
  standalone: true,
  imports: [
    MatDivider,
    MatLabel,
    MatRadioModule,
    CommonModule,
    FormsModule,
    MatFormField,
    MatSelectModule,
    MatOptionModule,
    MatButton,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './done-dialog.component.html',
  styleUrl: './done-dialog.component.scss'
})
export class DoneDialogComponent {
  dialogRef = inject(MatDialogRef<DoneDialogComponent>);
  private form = inject(FormBuilder);

  doneForm = this.form.group({
    done: [null, Validators.required],
    timeToday: [null, Validators.required]
  })

  getHourRange() {
    return Array.from({length: 12}, (_, i) => i+3); // Generates [3, 4, 5, ..., 14]
  }

  onConfirm() {
    if (this.doneForm.valid) {
      this.dialogRef.close(this.doneForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
