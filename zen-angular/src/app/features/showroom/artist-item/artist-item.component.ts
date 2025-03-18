import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { Pictures } from '../../../shared/models/pictures';
import { User } from '../../../shared/models/user';
import { GlobalCurrencyPipe } from '../../../shared/pipes/global-currency.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-artist-item',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    CommonModule,
    GlobalCurrencyPipe,
    TranslateModule
  ],
  templateUrl: './artist-item.component.html',
  styleUrl: './artist-item.component.scss'
})
export class ArtistItemComponent implements OnInit {
  @Input() artist?: User;
  private accountService = inject(AccountService);

  pictures: Pictures[] = [];
  currentPictureIndex: number = 0;

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.accountService.getPortfolioCut(this.artist!.id).subscribe(result => {
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
}
