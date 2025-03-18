import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {MatIcon, MatIconModule} from '@angular/material/icon'; 
import { MatButton } from '@angular/material/button';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge'; 
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';
import { MessengerService } from '../../core/services/messenger.service';
import { BusyService } from '../../core/services/busy.service';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar'; 
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ShowroomStatusComponent } from '../showroom-status/showroom-status.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem,
    IsAdminDirective,
    MatBadgeModule,
    MatProgressBar,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  accountService = inject(AccountService);
  messengerService = inject(MessengerService);
  busyService = inject(BusyService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  currentLang: string = 'en';
  badge = computed(() => this.messengerService.unread() > 0);

  ngOnInit(): void {
    // Load saved language or default to English
    const savedLang = localStorage.getItem('language') || 'en';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
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
