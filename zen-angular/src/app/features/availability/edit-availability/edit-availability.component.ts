import { Component, inject, OnInit } from '@angular/core';
import { CalendarService } from '../../../core/services/calendar.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-calendar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatButton,
    MatDatepickerModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSelectionList,
    MatListModule,
    TranslateModule
  ],
  templateUrl: './edit-availability.component.html',
  styleUrl: './edit-availability.component.scss'
})
export class EditAvailabilityComponent implements OnInit {
  private calendarService = inject(CalendarService)
  private fb = inject(FormBuilder);
  private snack = inject(SnackbarService);
  private translate = inject(TranslateService);

  form!: FormGroup;
  data = inject(MAT_DIALOG_DATA) as { type: string, calendarId: number };
  days: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  translatedDays: string[] = [];
  selectedDays: string[] = [];
  hours: string[] = [];
  currentStep: number = 1;
  mindate: Date = new Date();
  validationErrors?: string[];

  ngOnInit(): void {
    this.initForm();
    this.initHours();
    this.translateDays();
  }

  initForm() {
    const calendarId = this.data.calendarId
    switch (this.data.type) {
      case 'workingHours':
        this.form = this.fb.group({
          id: [calendarId],
          selectedDays: [[], Validators.required]
        });
        // Listen for changes in the selected days and dynamically add controls
        this.form.get('selectedDays')?.valueChanges.subscribe((selectedDays: string[]) => {
          this.selectedDays = selectedDays;
        })
        break;
      case 'add-holiday':
        this.form = this.fb.group({
          calendarId: [calendarId],
          startDate: [Date, Validators.required],
          endDate: [Date, Validators.required]
        })
    }
  }

  initHours() {
    for (let i = 8; i <= 22; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      this.hours.push(hour);
    }
  }

  translateDays() {
    this.translatedDays = this.days.map(day => this.translate.instant(`availability-dialog.days.${day}`));
  }

  nextStepWorkingHours(): void {
    if (this.form.get('selectedDays')?.valid) {
      // Add controls for the selected days
      this.selectedDays.forEach(day => {
        this.form.addControl(`${day}Begin`, this.fb.control('10:00', Validators.required));
        this.form.addControl(`${day}End`, this.fb.control('18:00', Validators.required));
      });
      this.currentStep = 2; // Move to the second step
    }
  }

  submit() {
    switch (this.data.type) {
      case 'workingHours':
        this.calendarService.setWorkingHours(this.form.value).subscribe({
          next: () => {
            window.location.reload();
            this.snack.success("Working hours updated successfully");
          },
          error: (err) => this.validationErrors = err
        });
        break;
      case 'add-holiday':
        this.calendarService.setHoliday(this.form.value).subscribe({
          next: () => {
            window.location.reload();
            this.snack.success("Holiday set successfully");
          },
          error: (err) => this.validationErrors = err
        })
    }
  }
}
