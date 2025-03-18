import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';
import { environment } from '../../../environments/environment';
import { Address, User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class ShowroomService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getArtists(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }

    if (shopParams.minPrice != undefined) {
      params = params.append('minPrice', shopParams.minPrice);
    }

    if (shopParams.maxPrice != undefined) {
      params = params.append('maxPrice', shopParams.maxPrice);
    }

    if (shopParams.styles != undefined) {
      params = params.append('styles', shopParams.styles.join(','));
    }

    if (shopParams.postalCode != undefined && shopParams.radius != undefined) {
      params = params.append('postalCode', shopParams.postalCode);
      params = params.append('radius', shopParams.radius)
    }

    params = params.append('pageIndex', shopParams.pageNumber);

    return this.http.get<Pagination<User>>(this.baseUrl + 'artists', {params});
  }

  getArtist(id: number) {
    return this.http.get<User>(this.baseUrl + 'artists/' + id);
  }

  getAddress(id: number) {
    return this.http.get<Address>(this.baseUrl + 'artists/address/' + id);
  }
}
