import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../shared/models/review';
import { Pagination } from '../../../shared/models/pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewParams } from '../../../shared/models/reviewParams';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-artist-reviews',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    EmptyStateComponent
  ],
  templateUrl: './artist-reviews.component.html',
  styleUrl: './artist-reviews.component.scss'
})
export class ArtistReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  stars = [1, 2, 3, 4, 5]; // Array representing stars
  reviews: Pagination<Review> | undefined;
  reviewParams = new ReviewParams();  

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.reviewParams.artistId = id ? +id : undefined; // Convert to number or assign undefined

    if (!this.reviewParams.artistId) {
      console.error('Artist ID is invalid or missing');
      return;
    }
  
    this.reviewService.getReviewsForArtist(this.reviewParams).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: err => console.error(err)
    });
  }

  redirectToArtist() {
    this.router.navigateByUrl('/showroom/' + this.reviewParams.artistId);
  }
}
