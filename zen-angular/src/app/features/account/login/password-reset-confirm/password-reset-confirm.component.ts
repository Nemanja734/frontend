import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password-reset-confirm',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    MatError,
    TranslateModule
  ],
  templateUrl: './password-reset-confirm.component.html',
  styleUrl: './password-reset-confirm.component.scss'
})
export class PasswordResetConfirmComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private snack = inject(SnackbarService);

  email?: string;
  token?: string;
  hidePassword = true;
  resetPasswordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    // Extract query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    })
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) return;
    const payload = {
      email: this.email,
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword
    };

    this.accountService.resetPassword(payload).subscribe({
      next: () => {
        this.snack.success("Password reset successful");
        this.router.navigateByUrl("/account/login");
      },
      error: err => {
        console.error(err);
        this.snack.error('An error occurred while resetting the password. Please try again.');
        this.router.navigateByUrl("account/login")
      }
    })
  }

  passwordsMatch(formGroup: FormGroup) {
    const { newPassword, confirmPassword } = formGroup.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }
}
