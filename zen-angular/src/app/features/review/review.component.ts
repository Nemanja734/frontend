import { Component, inject, OnInit } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../shared/models/appointment';
import { ReviewService } from '../../core/services/review.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { AppointmentStatusPipe } from '../../shared/pipes/appointment-status.pipe';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    MatDivider,
    AppointmentStatusPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private reviewService = inject(ReviewService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private rf = inject(FormBuilder);
  private snack = inject(SnackbarService);

  appointment?: Appointment;
  rating = 0;
  hoverRatingValue = 0;
  stars = [1, 2, 3, 4, 5]; // Array representing stars

  reviewForm = this.rf.group({
    appointmentId: [-1, Validators.required],
    headline: [''],
    reviewText: [''],
    stars: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
  })

  loading = false;

  ngOnInit(): void {
    this.loadAppointment();
  }

  loadAppointment() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.appointmentService.getAppointmentDetailed(+id).subscribe({
      next: appointment => {
        this.appointment = appointment;
        this.reviewForm.patchValue({ appointmentId: appointment.id });
      },
      error: err => console.error(err)
    });
  }

  onSubmit() {
    this.loading = true;
    this.reviewService.createReview(this.reviewForm.value).subscribe({
      next: () => {
        this.router. navigateByUrl('/review/success');
      },
      error: err => {
        console.log(err);
        this.snack.error("Problem at creating the review, please try again later.")
      }
    })
  }

  setRating(value: number) {
    this.rating = value;
    this.reviewForm.patchValue({ stars: this.rating });
  }

  hoverRating(value: number) {
    this.hoverRatingValue = value;
  }
}
