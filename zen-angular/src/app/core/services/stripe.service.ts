import { inject, Injectable } from '@angular/core';
import { ConfirmationToken, loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../../shared/models/appointment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private stripePromise: Promise<Stripe | null>;
  private elements?: StripeElements;
  private paymentElement?: StripePaymentElement;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  // Creating Stripe Account
  getAccountId() {
    return this.http.get(this.baseUrl + 'payments/account-id', {responseType: 'text'});
  }

  createStripeAccount() {
    return this.http.get(this.baseUrl + 'payments/create-account');
  }

  getLoginLink() {
    return this.http.get(this.baseUrl + 'payments/login', {responseType: 'text'});
  }

  getOnboardingLink(accountId: string) {
    return this.http.post(this.baseUrl + 'payments/onboard', { accountId }, { responseType: 'text' });
  }

  // Checkout
  createOrUpdatePaymentIntent(appointment: Appointment) {
    if (!appointment) throw new Error("Problem with your appointment configuration.");
    return this.http.post<Appointment>(this.baseUrl + 'payments', appointment);
  }

  async createConfirmationToken(appointment: Appointment) {
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements(appointment);
    const result = await elements.submit();
    if (result.error) throw new Error(result.error.message);
    if (stripe) {
      return await stripe.createConfirmationToken({elements});
    } else {
      throw new Error('Stripe not available.')
    }
  }

  async confirmPayment(appointment: Appointment, confirmationToken: ConfirmationToken) {
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements(appointment);
    const result = await elements.submit();
    if (result.error) throw new Error(result.error.message);

    const clientSecret = appointment.clientSecret;

    if (stripe && clientSecret) {
      return await stripe.confirmPayment({
        clientSecret: clientSecret,
        confirmParams: {
          confirmation_token: confirmationToken.id
        },
        redirect: 'if_required'
      })
    } else {
      throw new Error('Unable to load stripe.');
    }
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  // This method is the only one that gets called from the createXElement() Method
  async initializeElements(appointment: Appointment) {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        // Create Payment Element with Client Secret
        this.elements = stripe.elements({ clientSecret: appointment.clientSecret, appearance: { labels: 'floating' } })
      } else {
        throw new Error('Stripe has not been loaded');
      }
    }
    return this.elements;
  }

  async createPaymentElement(appointment: Appointment) {
    if (!this.paymentElement) {
      const elements = await this.initializeElements(appointment);
      if (elements) {
        this.paymentElement = elements.create('payment', {
          layout: 'tabs', // Optional layout customization
          paymentMethodOrder: ['card'], // Specify allowed payment methods (e.g., 'card' only)
        });
      }
    } // else {
    //   throw new Error('Elements instance has not been initialized. Reload the page to load all functionalities.');
    // }
    return this.paymentElement;
  }

  disposeElements() {
    this.elements = undefined;
    this.paymentElement = undefined;
  }
}
