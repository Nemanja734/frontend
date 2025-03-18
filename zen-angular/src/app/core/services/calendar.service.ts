import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Calendar, Holiday, WorkingHours } from '../../shared/models/calendar';
import { Appointment } from '../../shared/models/appointment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  getCalendarId() {
    return this.http.get<number>(this.baseUrl + 'availability/calendar-id');
  }

  getWorkingHours() {
    return this.http.get<WorkingHours>(this.baseUrl + 'availability/working-hours');
  }

  getHolidays() {
    return this.http.get<Holiday[]>(this.baseUrl + 'availability/holidays');
  }

  getAppointmentDates() {
    return this.http.get<string[]>(this.baseUrl + 'availability/appointments');
  }

  setWorkingHours(workingHours: WorkingHours) {
    return this.http.put(this.baseUrl + 'profile/working-hours', workingHours);
  }

  setHoliday(holiday: Holiday) {
    return this.http.post(this.baseUrl + 'availability/holiday', holiday);
  }

  updateHoliday(holiday: Holiday) {
    return this.http.put(this.baseUrl + 'availability/holiday', holiday);
  }

  deleteHoliday(id: number) {
    return this.http.delete(this.baseUrl + 'availability/holiday/' + id);
  }
}
