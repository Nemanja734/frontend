import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Appointment } from '../../../shared/models/appointment';
import { AppointmentService } from '../../../core/services/appointment.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout-date',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    CommonModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './checkout-date.component.html',
  styleUrl: './checkout-date.component.scss'
})
export class CheckoutDateComponent {
  @Input() appointment!: Appointment;

  private appointmentService = inject(AppointmentService);
  private snack = inject(SnackbarService);

  @Output() selectedDatesChange = new EventEmitter<string[]>();
  @Output() dateComplete = new EventEmitter<boolean>();

  requiredDates: number = 1;
  dateOptions: string[] = [];
  selectedDatesControl = new FormControl<string[]>([]);

  currentMonth: Date;
  calendarDays: (Date | null)[] = [];

  constructor() {
    this.currentMonth = new Date();
  }

  initialize() {
    this.getDates();
    this.getRequiredDates();
    this.generateCalendar();
    this.clearAllDates();
  }

  getRequiredDates() {
    if (this.appointment.estimatedTime! > 8 && this.appointment.estimatedTime! <= 20) {
      this.requiredDates = 2;
    } else if (this.appointment.estimatedTime! > 20) {
      this.requiredDates = 3;
    } else {
      this.requiredDates = 1;
    }
  }

  getDates() {
    this.appointmentService.getDates(this.appointment).subscribe({
      next: response => {
        this.dateOptions = response;
        // this.normalizeDateOptions();
      },
      error: err => console.log("Error when getting the possible dates for the appointment: " + err)
    });
  }

  normalizeDateOptions() {
    console.log(this.dateOptions);
    this.dateOptions = this.dateOptions.map((option) => {
      const date = new Date(option);
      return date.toLocaleDateString('en-CA');
    })
  }

  // Checkout Calendar
  isDateOption(day: Date | null) {
    if (!day || !this.dateOptions || this.dateOptions.length === 0) return false;
    const dayString = day.toLocaleDateString('en-CA');  // Convert to YYYY-MM-DD format
    return this.dateOptions.find(date => date.startsWith(dayString)); // Match by date
  }

  // Check if a date is selected
  isSelected(day: Date) {
    const dayString = day.toLocaleDateString('en-CA');
    return this.selectedDates.find(date => date.startsWith(dayString));
  }

  // Select or unselect a date
  toggleDateSelection(day: Date) {
    const dayString = day.toLocaleDateString('en-CA');
    // Find the full datetime string from datesToReturn
    const fullDateTime = this.dateOptions.find(date => date.startsWith(dayString));

    if (!fullDateTime) {
      console.error(`No matching datetime found for ${dayString}`);
      return;
    }

    // Get current value of selected dates
    const currentDates = [...(this.selectedDatesControl.value || [])]

    if (this.isSelected(day)) {
      // Unselect the date
      const index = currentDates.findIndex(date => date.startsWith(dayString));
      if (index !== -1) {
        currentDates.splice(index, 1);  // Remove the date from the array
      }
    } else {
      // Select the date if under the required limit
      if (this.requiredDates && currentDates.length < this.requiredDates) {
        currentDates.push(this.dateOptions.find(date => date.startsWith(dayString))!);
      } else {
        this.snack.error(`You can only select up to ${this.requiredDates} dates.`);
        return;
      }
    }
    // Update the FormControl value
    this.selectedDatesControl.setValue(currentDates);
    this.selectedDatesChange.emit(currentDates);
    this.dateComplete.emit(currentDates.length === this.requiredDates)
  }

  clearAllDates() {
    while (this.selectedDates.length !== 0) {
      // Remove the value in array 0
      this.selectedDates.splice(0, 1);
    }
    this.selectedDatesChange.emit([]);
  }

  // Get the FormArray
  get selectedDates(): string[] {
    return this.selectedDatesControl?.value || [];
  }



  // CALENDAR COMPONENT SECTION
  generateCalendar() {
    const firstDayOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0
    );

    const daysInMonth = [];
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;  // Sunday = 0, Monday = 1, etc. --> shift sunday to the end (6)

    // Fill empty days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      daysInMonth.push(null);
    }

    // Fill the actual days of the month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      daysInMonth.push(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
    }

    this.calendarDays = daysInMonth;
  }

  isToday(day: Date | null) {
    if (!day) return false;
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  toToday() {
    this.currentMonth = new Date();
    this.generateCalendar();
  }

  isPast(day: Date | null): boolean {
    if (!day) return false;

    const today = new Date();

    // Compare the given day with today's date
    return (
      day.getFullYear() < today.getFullYear() ||
      (day.getFullYear() === today.getFullYear() &&
        (day.getMonth() < today.getMonth() ||
          (day.getMonth() === today.getMonth() && day.getDate() < today.getDate())))
    );
  }

  invalidDateSnack() {
    this.snack.error("The artist is booked out on this date")
  }
}