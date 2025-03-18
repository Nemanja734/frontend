import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ArtistSummaryComponent } from "../../shared/components/artist-summary/artist-summary.component";
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Step1Component } from './step-1/step-1.component';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../shared/models/appointment';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { StripeService } from '../../core/services/stripe.service';
import { ConfirmationToken, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';
import { firstValueFrom } from 'rxjs';
import { Step5Component } from "./step-5/step-5.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CheckoutPictureComponent } from './checkout-picture/checkout-picture.component';
import { CheckoutDateComponent } from './checkout-date/checkout-date.component';
import { MessengerService } from '../../core/services/messenger.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalCurrencyPipe } from '../../shared/pipes/global-currency.pipe';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    ArtistSummaryComponent,
    MatStepperModule,
    MatButton,
    Step1Component,
    CurrencyPipe,
    CommonModule,
    MatRadioModule,
    Step5Component,
    MatProgressSpinnerModule,
    CheckoutPictureComponent,
    CheckoutDateComponent,
    TranslateModule,
    GlobalCurrencyPipe
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  @ViewChild(CheckoutDateComponent) dateComponent!: CheckoutDateComponent;

  private appointmentService = inject(AppointmentService);
  private snack = inject(SnackbarService);
  private activatedRoute = inject(ActivatedRoute);
  private stripeService = inject(StripeService);
  private messengerService = inject(MessengerService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  paymentElement?: StripePaymentElement;
  completionStatus = signal<{ tattoo: boolean, picture: boolean, date: boolean, card: boolean }>
    ({ tattoo: false, picture: false, date: false, card: false });
  confirmationToken?: ConfirmationToken;
  loading = false;
  isXlScreen: boolean = true;
  isMobile: boolean = true

  pictures: File[] = [];
  selectedDates: string[] = [];

  appointment: Appointment = {
    artistId: 0,
    size: 0,
    quality: 0,
  };

  async ngOnInit() {
    // Defines if the screen is 1280px wide
    this.breakpointObserver.observe('(min-width: 1400px)').subscribe(result => {
      this.isXlScreen = result.matches;
    })
    this.breakpointObserver.observe(['(max-width: 972px)']).subscribe(result => {
      this.isMobile = result.matches;
    });

    // For artist summary component
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam === null) return;
    this.appointment.artistId = +idParam;

    // Create Payment Intent for Appointment
    this.appointment = await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent(this.appointment));

    if (this.appointment.clientSecret != null) {
      // Create Payment Element from Stripe
      try {
        this.paymentElement = await this.stripeService.createPaymentElement(this.appointment);
        this.paymentElement!.mount('#payment-element');
        this.paymentElement!.on("change", this.handlePaymentChange)
      } catch (error: any) {
        this.snack.error(error.message);
      }
    } else {
      throw new Error("Could not create Payment Intent on time.")
    }
  }

  async getConfirmationToken() {
    try {
      // This returns true if all status of completionStatus() is true
      if (Object.values(this.completionStatus()).every(status => status === true)) {
        const result = await this.stripeService.createConfirmationToken(this.appointment);
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
      }
    } catch (error: any) {
      this.snack.error("Error at getting confirmation token: " + error.message);
    }
  }

  async onStepChange(event: StepperSelectionEvent) {
    const stepLabel = event.selectedStep.label;
    if (stepLabel === 'Tattoo') {
      this.completionStatus.update(state => {
        state.date = false;
        state.card = false;
        return state;
      })
    }
    if (stepLabel === 'Picture') {
    }
    if (stepLabel === 'Price') {
    }
    if (stepLabel === 'Date' || stepLabel === 'Datum') {
      this.dateComponent.initialize();
    }
    if (stepLabel === 'Payment') {
    }
    if (stepLabel === 'Checkout' || stepLabel === 'Kasse') {
      // Create Payment Intent after subtotal is fetched
      this.appointment = await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent(this.appointment));
      // One Confirmation Token can only be used once
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    // Check if appointment dates are still viable
    if (await firstValueFrom(this.appointmentService.checkDates(this.appointment)) === false) {
      this.snack.error("One of the appointment dates is not free anymore. Please select another date.")
      this.loading = false;
      // Reset the date component
      this.dateComponent.clearAllDates();
      // Navigate to date stepper
      stepper.steps.toArray().findIndex(step => step.label === 'Date');
    } else {
      try {
        if (this.confirmationToken) {
          const result = await this.stripeService.confirmPayment(this.appointment, this.confirmationToken);
  
          if (result.paymentIntent?.status === 'succeeded') {
            const appointment = this.createFormData();
            const appointmentResult = await firstValueFrom(this.appointmentService.createAppointment(appointment));
            if (appointmentResult) {
              this.router.navigateByUrl('/checkout-success');
            } else {
              throw new Error('Order creation failed');
            }
          } else if (result.error) {
            throw new Error(result.error.message);
          } else {
            throw new Error('Something went wrong')
          }
        }
      } catch (error: any) {
        this.snack.error(error.message || 'Something went wrong');
        stepper.previous();
      } finally {
        this.loading = false;
      }
    }
  }

  // To be able to work with pictures, we have to use FormData
  private createFormData(): FormData {

    const card = this.confirmationToken?.payment_method_preview.card;

    if (!card) throw new Error('Problem creating order');

    const formData = new FormData();

    // Append basic fields
    formData.append('artistId', this.appointment.artistId.toString());
    formData.append('bodyPart', this.appointment.bodyPart || '');
    formData.append('size', this.appointment.size.toString());
    formData.append('quality', this.appointment.quality.toString());
    formData.append('description', this.appointment.description || '');
    this.selectedDates!.forEach(date => formData.append('date', date));
    formData.append('paymentIntentId', this.appointment.paymentIntentId || '');

    // Append PaymentSummary fields
    formData.append('Last4', card.last4);
    formData.append('Brand', card.brand);
    formData.append('ExpMonth', card.exp_month.toString());
    formData.append('ExpYear', card.exp_year.toString());


    // Append pictures as files
    this.pictures!.forEach((file) => formData.append('pictures', file));


    return formData;
  }

  handleTattooChange(event: boolean) {
    this.completionStatus.update(state => {
      state.tattoo = event;
      return state;
    })
  }

  handlePictureChange(event: boolean) {
    this.completionStatus.update(state => {
      state.picture = event;
      return state;
    })
  }

  handleDateChange(event: boolean) {
    this.completionStatus.update(state => {
      state.date = event;
      return state;
    })
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state;
    })
  }

  onTattooDtoSelected(tattooDto: Appointment) {
    tattooDto.artistId = this.appointment.artistId;
    this.appointment.bodyPart = tattooDto.bodyPart;
    this.appointment.size = tattooDto.size;
    this.appointment.quality = tattooDto.quality;
    this.appointment.subtotal = tattooDto.subtotal;
    this.appointment.estimatedTime = tattooDto.estimatedTime;
    // Call the getSubtotal method with the TattooDto object
    this.appointmentService.getSubtotal(tattooDto).subscribe({
      // Save new TattooDto with Subtotal and Estimated Time from API in appointment
      next: result => {
        this.appointment.estimatedTime = result.estimatedTime;
        this.appointment.subtotal = result.subtotal;
      },
      error: err => console.log("Error fetching subtotal:", err)
    });
  }

  onPictureSelected(appointment: Appointment) {
    this.appointment.description = appointment.description;
    this.pictures = appointment.pictures!;
  }

  onDateSelected(dates: string[]) {
    this.selectedDates = dates;
  }
}