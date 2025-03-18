import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../../shared/models/appointment';
import { ConfirmationToken } from '@stripe/stripe-js';
import { PaymentCardPipe } from "../../../shared/pipes/payment-card.pipe";
import { MatDivider } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalCurrencyPipe } from '../../../shared/pipes/global-currency.pipe';
import { SizeEnumPipe } from '../../../shared/pipes/size-enum.pipe';
import { QualityEnumPipe } from '../../../shared/pipes/quality-enum.pipe';

@Component({
  selector: 'app-step-5',
  standalone: true,
  imports: [
    PaymentCardPipe,
    MatDivider,
    CommonModule,
    TranslateModule,
    GlobalCurrencyPipe,
    SizeEnumPipe,
    QualityEnumPipe
],
  templateUrl: './step-5.component.html',
  styleUrl: './step-5.component.scss'
})
export class Step5Component {
  @Input() appointment!: Appointment;
  @Input() confirmationToken?: ConfirmationToken;
  @Input() selectedDates?: any;
}
