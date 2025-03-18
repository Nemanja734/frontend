import { Component, ComponentRef, inject, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatRadioModule,
    NgIf,
    TextInputComponent,
    MatIconModule,
    MatError,
    MatSuffix,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private rf = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);

  registerForm = this.rf.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // confirmPassword: ['', Validators.required],
    role: ['', Validators.required],

    // Artist properties
    instagram: [], 
    hourlyRate: []
  });

  hidePassword = true;
  hideConfirmPassword = true;

  // Watch the role field for changes
  ngOnInit(): void {
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'Artist') {
        this.registerForm.get('instagram')?.setValidators(Validators.required);
        this.registerForm.get('hourlyRate')?.setValidators(Validators.required);
      } else {
        this.registerForm.get('instagram')?.clearValidators();
        this.registerForm.get('hourlyRate')?.clearValidators();
      }
      // Update validitators
      this.registerForm.get('instagram')?.updateValueAndValidity();
      this.registerForm.get('hourlyRate')?.updateValueAndValidity();
    })
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.accountService.getToken(this.registerForm.value.email!).subscribe();
        this.snack.success('Please verify your Email Address');
        // Redirect to email confirmation
        this.router.navigateByUrl('/account/confirmation', { state: { email: this.registerForm.value.email } });
      },
      error: errors => this.snack.error(errors[0])
    })
  }

  // Cuwstom validator to check if password and confirmPassword match
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    // Explicitly validate only when both fields have values
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }

    // If either field is empty or they match, return null (no error)
    return null;
  }
}
