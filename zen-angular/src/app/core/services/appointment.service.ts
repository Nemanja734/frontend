import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Appointment, AppointmentDone } from '../../shared/models/appointment';
import { environment } from '../../../environments/environment';
import { Pagination } from '../../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getSubtotal(tattoo: Appointment) {
    return this.http.post<Appointment>(this.baseUrl + 'appointments/subtotal', tattoo);
  }

  getDates(tattoo: Appointment) {
    return this.http.post<string[]>(this.baseUrl + 'appointments/dates', tattoo);
  }

  checkDates(appointment: Appointment) {
    return this.http.post<boolean>(this.baseUrl + 'appointments/date-checker', appointment);
  }

  createAppointment(appointment: FormData) {
    return this.http.post<Appointment>(this.baseUrl + 'appointments', appointment);
  }

  getAppointments(status: number[], page: number) {
    let params = new HttpParams();
    status.forEach(s => {
      params = params.append('status', s);
    });
    params = params.append('pageIndex', page);
    return this.http.get<Pagination<Appointment>>(this.baseUrl + 'appointments', {params});
  }

  // Appointment Detail Page
  getAppointmentDetailed(id: number) {
    return this.http.get<Appointment>(this.baseUrl + 'appointments/' + id);
  }

  // Appointment management
  removeAppointment(id: number) {
    return this.http.post(this.baseUrl + 'appointments/remove/' + id, {});
  }

  declineAppointment(id: number) {
    return this.http.post(this.baseUrl + 'appointments/decline/' + id, {});
  }

  acceptAppointment(id: number) {
    return this.http.post(this.baseUrl + 'appointments/accept/' + id, {});
  }

  cancelAsCustomer(id: number) {
    return this.http.post(this.baseUrl + 'appointments/cancelascustomer/' + id, {});
  }

  doneAppointment(appointmentDone: AppointmentDone) {
    return this.http.post<Appointment>(this.baseUrl + 'appointments/done', appointmentDone);
  }
}
