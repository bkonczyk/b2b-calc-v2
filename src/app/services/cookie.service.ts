import { Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppCookieService {
  // Sygnał informujący, czy użytkownik wyraził zgodę
  readonly consentGranted = signal(false);

  constructor(private cookieService: CookieService) {
    // Sprawdź przy starcie, czy zgoda już istnieje
    const hasConsent = this.cookieService.check('cookie_consent') && this.cookieService.get('cookie_consent') === 'true';
    this.consentGranted.set(hasConsent);

    if (hasConsent) {
      this.updateGtagConsent(true);
    }
  }

  public set(name: string, value: string): void {
    // Ustawiamy cookie na 365 dni i dla całej domeny ('/')
    this.cookieService.set(name, value, 365, '/');
  }

  public get(name: string): string {
    return this.cookieService.get(name);
  }

  public check(name: string): boolean {
    return this.cookieService.check(name);
  }

  public delete(name: string): void {
    this.cookieService.delete(name, '/');
  }

  // Metody do zarządzania zgodą
  public acceptConsent(): void {
    this.set('cookie_consent', 'true');
    this.consentGranted.set(true);
    this.updateGtagConsent(true);
  }

  public declineConsent(): void {
    this.set('cookie_consent', 'false');
    this.consentGranted.set(false);
    this.updateGtagConsent(false);
  }

  private updateGtagConsent(granted: boolean): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const status = granted ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        'ad_storage': status,
        'ad_user_data': status,
        'ad_personalization': status,
        'analytics_storage': status
      });
    }
  }
}
