import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatDivider } from '@angular/material/divider';
import { switchMap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIcon,
    MatSuffix,
    MatCheckbox,
    CommonModule,
    MatDivider,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private snack = inject(SnackbarService);
  returnUrl = `${window.location.origin}/showroom`
  hide = true;
  errorMessage: string | null = null;

  constructor() {
    const url = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if (url) this.returnUrl = url;
  }

  loginForm = this.fb.group({
    email: [''],
    password: [''],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snack.error('Please fill in all required fields.');
      return;
    }

    this.accountService.login(this.loginForm.value).pipe(
      switchMap(() => this.accountService.getUserInfo())
    ).subscribe({
      next: () => {
        console.log(this.returnUrl);
        window.location.href = this.returnUrl;
      },
      error: (err) => {
        if (err.error === 'Identity not confirmed') {
          this.errorMessage = err.error
          this.accountService.getToken(this.loginForm.value.email!).subscribe({
            next: () => {
              // Redirect to confirmation page
              this.router.navigateByUrl('/account/confirmation', { state: { email: this.loginForm.value.email } });
            }
          })
        } else {
          // Handle other errors
          this.errorMessage = 'Invalid email or password'
        } 
        this.snack.error(this.errorMessage!);
      }
    })
  }

  resendConfirmationEmail() {
    this.accountService.getToken(this.loginForm.value.email!).subscribe();
  }
}
