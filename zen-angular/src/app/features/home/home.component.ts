import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  accountService = inject(AccountService);
  locale: string = 'en'; // Default locale
  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    const storedLocale = localStorage.getItem('language');
    this.locale = storedLocale ? storedLocale : 'en';
  }

  ngAfterViewInit(): void {
    this.hideContent();
  }

  hideContent() {
    const hiddenContent = this.elRef.nativeElement.querySelectorAll('.hiddenContent')

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'visible');  // Add the 'visible' class
          observer.unobserve(entry.target); // Stop observing after animation
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    hiddenContent.forEach((element: Element) => {
      observer.observe(element);
    })
  }
}
