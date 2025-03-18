import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { Pictures } from '../../../../shared/models/pictures';
import { AccountService } from '../../../../core/services/account.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-verify-artist-item',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule
  ],
  templateUrl: './verify-artist-item.component.html',
  styleUrl: './verify-artist-item.component.scss'
})
export class VerifyArtistItemComponent implements OnInit {
  @Input() artist?: User;

  private accountService = inject(AccountService);
  private adminService = inject(AdminService);
  private snack = inject(SnackbarService);

  pictures: Pictures[] = [];
  currentPictureIndex: number = 0;

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.accountService.getPortfolio(this.artist!.id).subscribe(result => {
      this.pictures = result;
    });
  }

  // Navigate to the previous picture
  prevPicture() {
    if (this.pictures.length > 0) {
      this.currentPictureIndex = (this.currentPictureIndex - 1 + this.pictures.length) % this.pictures.length;
    }
  }

  // Navigate to the next picture
  nextPicture() {
    if (this.pictures.length > 0) {
      this.currentPictureIndex = (this.currentPictureIndex + 1) % this.pictures.length;
    }
  }

  verifyArtist() {
    this.adminService.verifyArtist(this.artist?.id!).subscribe({
      next: () => this.snack.success("Success"),
      error: err => this.snack.error("Error: " + err)
    });
  }
}
