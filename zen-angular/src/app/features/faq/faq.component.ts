import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatDivider
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
  selectedSection: 'artists' | 'customers' = 'artists';
  questionsArtist: string[] = ['cut', 'accept_appointments', 'cancel_appointments', 'miss_appointments', 'set_holidays', 'showroom_listing'];
  questionsCustomer: string[] = ['artist_qualification', 'no-answer', 'refund', 'cancel', 'time_refund', 'reschedule'];

  answerVisibleArtist: boolean[] = [];
  answerVisibleCustomer: boolean[] = [];

  ngOnInit(): void {
    // Initialize all answers as hidden
    this.answerVisibleArtist = this.questionsArtist.map(() => false);
  }

  toggleAnswerArtist(index:number) {
    // Toggle visibility of the selected answer
    this.answerVisibleArtist[index] = !this.answerVisibleArtist[index];
  }

  toggleAnswerCustomer(index: number) {
    this.answerVisibleCustomer[index] = !this.answerVisibleCustomer[index];
  }

  toggleFAQ(section: 'artists' | 'customers') {
    this.selectedSection = section;
  }
}
