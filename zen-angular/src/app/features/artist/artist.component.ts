import { Component, inject, OnInit } from '@angular/core';
import { ShowroomComponent } from '../showroom/showroom.component';
import { ShowroomService } from '../../core/services/showroom.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { Pictures } from '../../shared/models/pictures';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { AccountService } from '../../core/services/account.service';
import { ArtistSummaryComponent } from "../../shared/components/artist-summary/artist-summary.component";
import { User } from '../../shared/models/user';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatCard,
    MatDivider,
    ArtistSummaryComponent,
    TranslateModule
],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss'
})
export class ArtistComponent implements OnInit{
  accountService = inject(AccountService);
  private showroomService = inject(ShowroomService);
  private activatedRoute = inject(ActivatedRoute);
  artist?: User;
  portfolio: Pictures[] = [];

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.loadArtist(+id);
    this.loadPortfolio(+id);
  }

  loadArtist(id: number) {
    this.showroomService.getArtist(id).subscribe({
      next: artist => this.artist = artist,
      error: error => console.log(error)
    })
  }

  loadPortfolio(id: number) {
    this.accountService.getPortfolio(id).subscribe({
      next: pictures => this.portfolio = pictures,
      error: error => console.log(error)
    })
  }
}
