import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { map, of, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { Pictures } from '../../shared/models/pictures';
import { MessengerService } from './messenger.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  private notificationService = inject(NotificationService);
  private messengerService = inject(MessengerService);
  currentUser = signal<User | null>(null);
  isAdmin = computed(() => {
    const roles = this.currentUser()?.roles;
    return roles?.includes('Admin');
  })
  isArtist = computed(() => {
    const roles = this.currentUser()?.roles;
    return roles?.includes('Artist');
  })
  qualityOptions: string[] = [];
  sizeOptions: string[] = [];

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'account/login', values, { params, observe: 'response' }).pipe(
      tap(() => {
        this.notificationService.createHubConnection();
        this.messengerService.createHubConnection();
      })
    )
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values);
  }

  getToken(email: string) {
    return this.http.post(this.baseUrl + 'account/email-token', {email})
  }

  confirmToken(values: any) {
    return this.http.post(this.baseUrl + 'account/confirm-email', values)
  }

  resetPasswordMail(values: any) {
    return this.http.post(this.baseUrl + 'account/reset-password-mail', values)
  }

  resetPassword(values: any) {
    return this.http.post(this.baseUrl + 'account/reset-password', values);
  }


  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
      map(user => {
        this.currentUser.set(user);
        return user;
      })
    )
  }

  checkArtistShowroomStatus() {
    return this.http.get<string[]>(this.baseUrl + 'artists/showroom-status')
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {}).pipe(
      tap(() => {
        this.notificationService.stopHubConnection();
        this.messengerService.stopHubConnection();
      })
    );
  }

  updatePassword(passwords: any) {
    return this.http.post(this.baseUrl + 'account/change-password', passwords);
  }

  updateAddress(address: Address) {
    return this.http.post<Address>(this.baseUrl + 'profile/address', address);
  }

  updateStyle(styles: string[]) {
    return this.http.post<string[]>(this.baseUrl + 'profile/style', styles);
  }

  // Portfolio management
  getPortfolio(id: number) {
    return this.http.get<Pictures[]>(this.baseUrl + 'artists/portfolio/' + id);
  }

  getPortfolioCut(id: number) {
    return this.http.get<Pictures[]>(this.baseUrl + 'artists/portfolio-cut/' + id);
  }

  updatePortfolio(files: FormData) {
    return this.http.post<string[]>(this.baseUrl + 'profile/portfolio', files);
  }

  deletePicture(pictureId: number) {
    return this.http.delete(this.baseUrl + 'profile/portfolio/' + pictureId);
  }

  deletePortfolio() {
    return this.http.delete(this.baseUrl + 'profile/portfolio/all');
  }


  updateHourlyRate(hourlyRate: number) {
    return this.http.post(this.baseUrl + 'profile/rate', hourlyRate);
  }

  getAuthState() {
    return this.http.get<{ isAuthenticated: boolean }>(this.baseUrl + 'account/auth-status')
  }


  // A bit misplaced here, those two return quality/sizeOptions or get an updated list from API if there is none
  getQualityOptions() {
    if (this.qualityOptions.length > 0) return of(this.qualityOptions);
    return this.http.get<string[]>(this.baseUrl + 'profile/style-options').pipe(
      map(quality => {
        this.qualityOptions = quality;
        return quality;
      })
    );
  }

  getSizeOptions() {
    if (this.sizeOptions.length > 0) return of(this.sizeOptions);
    return this.http.get<string[]>(this.baseUrl + 'profile/quality-options').pipe(
      map(size => {
        this.sizeOptions = size;
        return size;
      })
    );
  }
}
