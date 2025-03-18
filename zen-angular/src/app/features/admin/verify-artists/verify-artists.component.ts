import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../shared/models/user';
import { Pagination } from '../../../shared/models/pagination';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { VerifyArtistItemComponent } from './verify-artist-item/verify-artist-item.component';

@Component({
  selector: 'app-verify-artists',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    VerifyArtistItemComponent
  ],
  templateUrl: './verify-artists.component.html',
  styleUrl: './verify-artists.component.scss'
})
export class VerifyArtistsComponent implements OnInit {
  private adminService = inject(AdminService);

  pageNumber: number = 1;
  artists?: Pagination<User>;

  ngOnInit(): void {
    this.getArtists();
  }

  getArtists() {
    this.adminService.getUnverifiedArtists(this.pageNumber).subscribe({
      next: artists => {
        this.artists = artists
      },
      error: err => {
        console.log("Error when fetching unverified artists: " + err);
      }
    });
  }

  handlePageEvent(event: number) {
    this.pageNumber = event;
    this.getArtists();
  }
}
