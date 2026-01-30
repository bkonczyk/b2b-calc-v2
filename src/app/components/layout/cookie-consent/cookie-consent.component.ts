import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCookieService } from '../../../services/cookie.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent implements OnInit {
  private cookieService = inject(AppCookieService);
  isVisible = false;

  ngOnInit(): void {
    // Okno jest widoczne, jeśli nie ma jeszcze żadnej decyzji
    if (!this.cookieService.check('cookie_consent')) {
      this.isVisible = true;
    }
  }

  acceptCookies(): void {
    this.cookieService.acceptConsent();
    this.isVisible = false;
  }

  declineCookies(): void {
    this.cookieService.declineConsent();
    this.isVisible = false;
  }
}
