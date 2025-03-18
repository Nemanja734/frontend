import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

declare var _paq: any[];

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [

  ],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    const consent = localStorage.getItem('trackingConsent');
    if (consent === 'accepted') {
      this.enableTracking();
      this.hideBanner();
    } else if (consent === 'rejected') {
      this.disableTracking();
      this.hideBanner();
    }
  }

  accept(): void {
    localStorage.setItem('trackingConsent', 'accepted');
    this.enableTracking();
    this.hideBanner();
  }

  reject(): void {
    localStorage.setItem('trackingConsent', 'rejected');
    this.disableTracking();
    this.hideBanner();
  }

  private enableTracking(): void {
    if (!_paq) {
      _paq = []; // Initialize _paq if it doesn't exist
    }
    _paq.push(['rememberConsentGiven']);
    _paq.push(['trackPageView']); // Start tracking only after consent
    _paq.push(['enableLinkTracking']); // Enable link tracking only after consent
    this.injectMatomoScript();
    console.log('Tracking enabled');
  }

  private disableTracking(): void {
    if (_paq) {
      _paq.push(['forgetConsentGiven']);
    }
    console.log('Tracking disabled');
  }

  private hideBanner(): void {
    const banner = document.getElementById('consent-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }

  private injectMatomoScript(): void {
    const existingScript = document.getElementById('matomo-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'matomo-script';
      script.async = true;
      script.src = 'https://analytics.zen-tattoo.de/matomo.js';
      document.head.appendChild(script);
      console.log('Matomo script added');
    }
  }
}
