import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    MatCardModule,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatError,
    CommonModule,
    MatLabel,
    MatInputModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private snack = inject(SnackbarService);

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.emailForm.valid) {
      this.accountService.resetPasswordMail(this.emailForm.value).subscribe({
        next: () => this.snack.success("Check your mailbox"),
        error: err => {
          this.snack.error("Failed sending the email. Please try again later.");
          console.error(err.error);
        }
      })
    }
  }
}
