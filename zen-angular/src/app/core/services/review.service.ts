import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Review } from '../../shared/models/review';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';
import { ReviewParams } from '../../shared/models/reviewParams';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  createReview(review: any) {
    return this.http.post(this.baseUrl + 'review', review);
  }

  getReviewsForArtist(reviewParams: ReviewParams) {
    let params = new HttpParams();
    params = params.append('artistId', reviewParams.artistId!);
    params = params.append('pageIndex', reviewParams.pageNumber);
    return this.http.get<Pagination<Review>>(this.baseUrl + 'review', {params});
  }

  deleteReview(reviewId: number) {
    return this.http.delete(this.baseUrl + 'review/' + reviewId);
  }
}
