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
      this.loadGoogleAnalytics();
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
    this.loadGoogleAnalytics();
  }

  public declineConsent(): void {
    this.set('cookie_consent', 'false');
    this.consentGranted.set(false);
    // Tutaj można by dodać logikę usuwania skryptu GA, ale zazwyczaj wystarczy nie ładować go ponownie
    // lub wyczyścić cookies GA.
  }

  private loadGoogleAnalytics(): void {
    // Sprawdź, czy skrypt już został załadowany
    if (document.getElementById('google-analytics-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-SDP3K452L2';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-SDP3K452L2');
  }
}
