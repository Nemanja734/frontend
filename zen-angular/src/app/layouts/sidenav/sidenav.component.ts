import { Component, computed, inject, OnInit } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';
import { MatDivider } from '@angular/material/divider';
import { AccountService } from '../../core/services/account.service';
import { MessengerService } from '../../core/services/messenger.service';
import { BusyService } from '../../core/services/busy.service';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    IsAdminDirective,
    CommonModule,
    MatProgressBar,
    TranslateModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
  accountService = inject(AccountService);
  messengerService = inject(MessengerService);
  busyService = inject(BusyService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  currentLang: string = 'en';
  badge = computed(() => this.messengerService.unread() > 0);
  isSidenavOpen = false;

  ngOnInit(): void {
    // Load saved language or default to English
    const savedLang = localStorage.getItem('language') || 'en';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSidenav() {
    this.isSidenavOpen = false;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('language', lang); // Save the selected language across the session
    window.location.reload();
  }

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        window.location.href = window.location.origin;
      }
    })
  }
}
