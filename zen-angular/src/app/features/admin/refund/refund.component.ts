import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DoneDialogComponent } from '../../../shared/components/done-dialog/done-dialog.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-refund',
  standalone: true,
  imports: [
    MatButton,
    ReactiveFormsModule,
    MatDialogModule,
    MatLabel,
    MatFormFieldModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './refund.component.html',
  styleUrl: './refund.component.scss'
})
export class RefundComponent {
  dialogRef = inject(MatDialogRef<DoneDialogComponent>);
  private form = inject(FormBuilder);

  refundForm = this.form.group({
    refund: [null, [Validators.required, Validators.min(1)]],
  })

  onSubmit() {
    if (this.refundForm.valid) {
      this.dialogRef.close(this.refundForm.value.refund);
    }
  }

  onCancel() {
    this.dialogRef.close
  }
}
