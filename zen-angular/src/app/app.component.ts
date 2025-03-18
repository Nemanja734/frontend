import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component';
import { ShowroomStatusComponent } from './layouts/showroom-status/showroom-status.component';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../../public/i18n/en.json'
import { FooterComponent } from './layouts/footer/footer.component';
import { CookiesComponent } from './layouts/cookies/cookies.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    ShowroomStatusComponent,
    CommonModule,
    SidenavComponent,
    TranslateModule,
    FooterComponent,
    CookiesComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Zen';

  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private translate = inject(TranslateService);
  private renderer = inject(Renderer2);

  isHomeRoute: boolean = false;
  isSmallScreen = false;
  showroomStatusHeight: number = 0;

  @ViewChild('showroomStatus', { static: false }) showroomStatusComponent!: ShowroomStatusComponent;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Define routes that need a full-screen background
        const homeRoutes = ['/', '/finance'];
        this.isHomeRoute = homeRoutes.includes(event.urlAfterRedirects);
      }
    });

    this.breakpointObserver.observe(['(max-width: 972px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
    });

    // Translations
    this.translate.addLangs(['de', 'en']);
    // this.translate.setTranslation('en', defaultLanguage); // Add default language
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  ngAfterViewInit() {
    const showroomStatusElement = this.renderer.selectRootElement(
      'app-showroom-status',
      true
    );

    if (showroomStatusElement) {
      this.showroomStatusHeight = showroomStatusElement.offsetHeight;
    }
  }
}
