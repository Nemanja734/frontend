import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  validateAddress(address: string) {
    return this.http.post<string>(this.baseUrl + 'geocoding/', { address });
  }
}
