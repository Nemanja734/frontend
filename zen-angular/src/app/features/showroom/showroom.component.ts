import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ShowroomService } from '../../core/services/showroom.service';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { ArtistItemComponent } from "./artist-item/artist-item.component";
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AccountService } from '../../core/services/account.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatDivider } from '@angular/material/divider';
import { SnackbarService } from '../../core/services/snackbar.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { User } from '../../shared/models/user';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-showroom',
  standalone: true,
  imports: [
    ArtistItemComponent,
    MatButton,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatListOption,
    MatSelectionList,
    MatSliderModule,
    EmptyStateComponent,
    MatMenuModule,
    FormsModule,
    PaginatorComponent,
    TranslateModule,
    MatIcon
  ],
  templateUrl: './showroom.component.html',
  styleUrl: './showroom.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ShowroomComponent implements OnInit {
  // For closing filter menus when clicking on apply
  @ViewChild('priceMenuTrigger') priceMenuTrigger!: MatMenuTrigger;
  @ViewChild('styleMenuTrigger') styleMenuTrigger!: MatMenuTrigger;
  @ViewChild('locationMenuTrigger') locationMenuTrigger!: MatMenuTrigger;

  private showroomService = inject(ShowroomService);
  private accountService = inject(AccountService);
  private snack = inject(SnackbarService);
  artists?: Pagination<User>;

  availableStyles: string[] = [];
  shopParams = new ShopParams();

  ngOnInit(): void {
    this.getArtists();
    this.getStyles();
  }

  // Dropdown Logic
  toggleDropdown(filter: string) {
    document.getElementById(filter)?.classList.toggle("filter__show");
  }
  
  closeDropdown() {
    const dropdowns = document.getElementsByClassName("filter__show")
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove("filter__show");
    }
  }

  getArtists() {
    this.showroomService.getArtists(this.shopParams).subscribe({
      next: response => {
        this.artists = response
      },
      error: error => {
        console.error(error);
        if (error.error == null) {
          this.snack.error(error[0]);
        } else {
          this.snack.error(error.error);
        }
      }
    })
  }

  handleFilterEvent() {
    this.priceMenuTrigger.closeMenu();
    this.styleMenuTrigger.closeMenu();
    this.locationMenuTrigger.closeMenu();
    this.getArtists();
  }

  setSort(sortOption: string) {
    this.shopParams.sort = sortOption;
    this.getArtists();
  }

  resetFilters() {
    this.shopParams = new ShopParams();
    this.getArtists();
  }

  // Stop Mat Menu from closing
  stopPropagation(event: any) {
    event.stopPropagation();
  }

  handlePageEvent(event: number) {
    this.shopParams.pageNumber = event;
    this.getArtists();
  }

  getStyles() {
    this.accountService.getQualityOptions().subscribe((r) => this.availableStyles = r);
  }
}
