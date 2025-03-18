import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

function initializeApp(InitService: InitService, translate: TranslateService) {
  return () => {
    // Initialize application services
    return lastValueFrom(InitService.init())
      .then(() => {
        // Set default locale or detect browser locale
        let defaultLocale = navigator.language || 'en';
        defaultLocale = defaultLocale.split('-')[0];
        return lastValueFrom(translate.use(defaultLocale));
      })
      .finally(() => {
        // Remove the splash screen once everything is loaded
        const splash = document.getElementById('initial-splash');
        if (splash) {
          splash.style.transition = 'opacity 0.3s ease';
          splash.style.opacity = '0';
          setTimeout(() => splash.remove(), 300);
        }
      })
  }
}

// Translations
const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      errorInterceptor, 
      loadingInterceptor,
      authInterceptor
    ])),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })]),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [InitService, TranslateService]
    }
  ]
};
