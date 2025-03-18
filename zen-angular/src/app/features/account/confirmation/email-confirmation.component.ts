import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatLabel,
    MatButton,
    TranslateModule
  ],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss'
})
export class EmailConfirmationComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private snack = inject(SnackbarService);

  email: string;
  confirmationForm!: FormGroup;

  constructor() {
    // Retrieve form data from router state
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras.state?.['email'];

    if (!this.email) {
      // Handle case where no data is passed
      this.router.navigateByUrl('/account/login');
    }

    this.confirmationForm = this.fb.group({
      email: this.email,
      token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/)]] // Only digits allowed
    })
  }

  onSubmit() {
    this.accountService.confirmToken(this.confirmationForm.value).subscribe({
      next: () => {
        this.snack.success('Email confirmed - you can now login');
        // Redirect to email confirmation
        this.router.navigateByUrl('/account/login');
      },
      error: () => this.snack.error("Invalid or expired token")
    })
  }
}
