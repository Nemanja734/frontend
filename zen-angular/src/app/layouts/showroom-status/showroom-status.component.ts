import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showroom-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './showroom-status.component.html',
  styleUrl: './showroom-status.component.scss'
})
export class ShowroomStatusComponent {
  private accountService = inject(AccountService);

  messages: string[] = [];

  ngOnInit(): void {
    if (this.accountService.currentUser()?.roles.includes('Artist')) {
      this.checkShowroomStatus();
    }
  }

  checkShowroomStatus() {
    this.accountService.checkArtistShowroomStatus().subscribe({
      next: msg => this.messages = msg
    })
  }
}
