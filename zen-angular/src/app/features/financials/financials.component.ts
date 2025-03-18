import { Component, inject, OnInit } from '@angular/core';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton
  ],
  templateUrl: './financials.component.html',
  styleUrl: './financials.component.scss'
})
export class FinancialsComponent implements OnInit {
  private stripeService = inject(StripeService);
  private snack = inject(SnackbarService);

  accountId?: string;
  loginLink?: string;
  onboardingLink?: string;

  ngOnInit(): void {
    this.getAccountId();
  }

  getAccountId() {
    this.stripeService.getAccountId().subscribe({
      next: id => {
        if (id === "-1") {
          this.createStripeAccount();
        } else {
          this.accountId = id;
          this.getLoginLink();
        }
      },
      error: err => {
        this.snack.error("Error at fetching account id.");
        console.error(err);
      }
    })
  }

  createStripeAccount() {
    this.stripeService.createStripeAccount().subscribe({
      next: () => {
        this.snack.success("Stripe Account created successfully.");
        this.getAccountId();
      },
      error: err => {
        this.snack.error("Failed creating the Stripe Account, please try again later.");
      }
    })
  }

  getLoginLink() {
    this.stripeService.getLoginLink().subscribe({
      next: link => {
        if (link === null) {
          this.getOnboardingLink();
        } else {
          this.loginLink = link;
        }
      },
      error: err => {
        this.snack.error("Error fetching the login link for Stripe. Please try again later.");
        console.error("Error fetching login link: " + err);
      }
    })
  }

  getOnboardingLink() {
    this.stripeService.getOnboardingLink(this.accountId!).subscribe({
      next: link => {
        this.onboardingLink = link;
        console.log(link);
      },
      error: err => {
        this.snack.error("Failed fetching the onboarding link, please try again later.");
      }
    })
  }
}
