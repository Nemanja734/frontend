import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CalendarService } from '../../core/services/calendar.service';
import { Holiday, WorkingHours, WorkingHoursArray } from '../../shared/models/calendar';
import { EditAvailabilityComponent } from './edit-availability/edit-availability.component';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '../../core/services/snackbar.service';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    MatCardModule,
    MatIcon,
    CommonModule,
    CalendarComponent,
    TranslateModule
  ],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss'
})
export class AvailabilityComponent implements OnInit {
  public dialog = inject(MatDialog);
  private calendarService = inject(CalendarService);
  private snack = inject(SnackbarService);
  private translate = inject(TranslateService);

  workingHours!: WorkingHours;
  workingHoursArray?: WorkingHoursArray[];
  holidays: Holiday[] = [];
  appointmentDates: string[] = [];
  calendarId?: number;
  editType: string = '';

  loading: boolean = true;

  async ngOnInit(): Promise<void> {
    try {
      await Promise.all([
        this.getWorkingHours(),
        this.getHolidays(),
        this.getAppointments(),
        this.getCalendarId(),
      ]);
    } catch (error) {
      this.snack.error("Failed to load some data. Please try again.");
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async getWorkingHours() {
    this.workingHours = await firstValueFrom(this.calendarService.getWorkingHours());
    this.workingHoursArray = this.getWorkingHoursArray(this.workingHours);
  }

  async getHolidays() {
    this.holidays = await firstValueFrom(this.calendarService.getHolidays());
  }

  async getAppointments() {
    this.appointmentDates = await firstValueFrom(this.calendarService.getAppointmentDates());
  }

  async getCalendarId() {
    try {
      this.calendarId = await firstValueFrom(this.calendarService.getCalendarId());
    } catch (error) {
      this.snack.error("Failed loading the data for the calendar. Please try again later.");
      console.error(error);
    }
  }

  openEditDialog(type: string) {
    const calendarId = this.calendarId;
    this.dialog.open(EditAvailabilityComponent, {
      width: '400px',
      data: { type, calendarId }
    });
  }

  deleteHoliday(id: number) {
    this.calendarService.deleteHoliday(id).subscribe({
      next: () => {
        this.snack.success(this.translate.instant('calendar.holidayDeleted'));
        this.holidays = this.holidays?.filter(holiday => holiday.id !== id);
      },
      error: err => {
        console.log(err);
        this.snack.error(this.translate.instant('calendar.holidayDeleteFailed'));
      }
    });
  }

  getWorkingHoursArray(workingHours: WorkingHours): WorkingHoursArray[] { 
    const locale = this.translate.currentLang || 'en'; // Get the current language
    const days = [
      new Date(2023, 0, 2).toLocaleDateString(locale, { weekday: 'long' }), // Monday
      new Date(2023, 0, 3).toLocaleDateString(locale, { weekday: 'long' }), // Tuesday
      new Date(2023, 0, 4).toLocaleDateString(locale, { weekday: 'long' }), // Wednesday
      new Date(2023, 0, 5).toLocaleDateString(locale, { weekday: 'long' }), // Thursday
      new Date(2023, 0, 6).toLocaleDateString(locale, { weekday: 'long' }), // Friday
      new Date(2023, 0, 7).toLocaleDateString(locale, { weekday: 'long' }), // Saturday
      new Date(2023, 0, 8).toLocaleDateString(locale, { weekday: 'long' })  // Sunday
    ];
  
    return [
      { day: days[0], start: workingHours.mondayBegin, end: workingHours.mondayEnd },
      { day: days[1], start: workingHours.tuesdayBegin, end: workingHours.tuesdayEnd },
      { day: days[2], start: workingHours.wednesdayBegin, end: workingHours.wednesdayEnd },
      { day: days[3], start: workingHours.thursdayBegin, end: workingHours.thursdayEnd },
      { day: days[4], start: workingHours.fridayBegin, end: workingHours.fridayEnd },
      { day: days[5], start: workingHours.saturdayBegin, end: workingHours.saturdayEnd },
      { day: days[6], start: workingHours.sundayBegin, end: workingHours.sundayEnd }
    ];
  }
}
