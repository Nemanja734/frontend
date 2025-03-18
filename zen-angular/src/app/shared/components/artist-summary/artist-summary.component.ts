import { Component, inject, Input, OnInit } from '@angular/core';
import { AccountService } from '../../../core/services/account.service';
import { ShowroomService } from '../../../core/services/showroom.service';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { User } from '../../models/user';
import { GlobalCurrencyPipe } from '../../pipes/global-currency.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-artist-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButton,
    GlobalCurrencyPipe,
    TranslateModule
  ],
  templateUrl: './artist-summary.component.html',
  styleUrl: './artist-summary.component.scss'
})
export class ArtistSummaryComponent implements OnInit{
  // You can pass the artist id or the artist in a whole
  @Input() id?: number;
  @Input() artist?: User;

  accountService = inject(AccountService)
  private showroomService = inject(ShowroomService);
  location = inject(Location);

  ngOnInit(): void {
    if (this.id) {
      this.loadArtist(this.id)
    } 
  }

  loadArtist(id: number) {
    this.showroomService.getArtist(id).subscribe({
      next: artist => this.artist = artist,
      error: err => console.log(err)
    })
  }

  isAppointmentPath() {
    return /^\/checkout\/[a-zA-Z0-9]+$/.test(this.location.path());
  }
}
