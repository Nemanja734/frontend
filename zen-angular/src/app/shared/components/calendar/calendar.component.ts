import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Holiday, WorkingHoursArray } from '../../models/calendar';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  // Availability Component
  @Input() appointments: string[] = [];
  @Input() holidays: Holiday[] | undefined;
  @Input() workingHoursArray: WorkingHoursArray[] | undefined;

  private snack = inject(SnackbarService);
  private translate = inject(TranslateService);

  processedHolidays: string[] = [];
  currentMonth: Date;
  calendarDays: (Date | null)[] = [];

  constructor() {
    this.currentMonth = new Date();
  }

  ngOnInit(): void {
    this.processHolidays();
    this.normalizeAppointments();
    this.generateCalendar();
  }

  get currentMonthLocalized() {
    const currentLang = this.translate.currentLang || 'en';
    return new Intl.DateTimeFormat(currentLang, { month: 'long', year: 'numeric' }).format(this.currentMonth);
  }

  processHolidays() {
    this.processedHolidays = [];
    // Shape each holiday entry to be compareable
    this.holidays?.forEach((holiday) => {
      const startDate = new Date(holiday.startDate);
      const endDate = new Date(holiday.endDate);
      // Expand all dates in the range
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        this.processedHolidays.push(new Date(date).toISOString().split('T')[0]);
      }
    })
  }

  normalizeAppointments() {
    // Normalize appointment dates into the right format
    this.appointments = this.appointments.map((appointment) => {
      const date = new Date(appointment);
      return date.toLocaleDateString('en-CA');
    });
  }

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

  // Artist Calendar
  isAppointment(day: Date | null): boolean {
    if (!day || !this.appointments) return false;
    // Compare dates in local time
    const dayString = day.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    return this.appointments.includes(dayString);
  }

  isHoliday(day: Date | null) {
    if (!day) return false;
    return this.processedHolidays.includes(day.toISOString().split('T')[0]);
  }

  isWorkingDay(day: Date | null) {
    if (!day || this.workingHoursArray === undefined) return false;

    const locale = this.translate.currentLang || 'en'; // Match the locale
    const weekday = day.toLocaleDateString(locale, { weekday: 'long' });
    const workingDay = this.workingHoursArray.find((wh) => wh.day === weekday);
  
    // Check if the working day has a valid start and end time
    return !!(workingDay && workingDay.start && workingDay.end);
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
}
