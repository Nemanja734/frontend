import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user';
import { Pagination } from '../../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Appointment } from '../../shared/models/appointment';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUsers(userParams: ShopParams) {
    let params = new HttpParams();

    if (userParams.email != undefined) {
      params = params.append('email', userParams.email);
    }

    params = params.append('pageIndex', userParams.pageNumber);

    return this.http.get<Pagination<User>>(this.baseUrl + 'admin/users', { params });
  }

  deactivateUser(email: string) {
    let params = new HttpParams();
    params = params.append('email', email);
    return this.http.get(this.baseUrl + 'admin/users/deactivate', { params });
  }

  getAppointments(appointmentParams: ShopParams) {
    let params = new HttpParams();

    if (appointmentParams.email != undefined) {
      params = params.append('email', appointmentParams.email);
    }

    params = params.append('pageIndex', appointmentParams.pageNumber);

    return this.http.get<Pagination<Appointment>>(this.baseUrl + 'admin/appointments', { params });
  }

  refundAppointment(id: number, refundPercentage: number) {
    let params = new HttpParams();

    params = params.append('id', id).append('refund', refundPercentage);

    return this.http.get(this.baseUrl + 'admin/appointments/refund', { params });
  }

  getUnverifiedArtists(pageNumber: number) {
    let params = new HttpParams();

    params = params.append('pageIndex', pageNumber);

    return this.http.get<Pagination<User>>(this.baseUrl + 'admin/unverified')
  }

  verifyArtist(id: number) {
    return this.http.get(this.baseUrl + 'admin/verify/' + id);
  }
}
