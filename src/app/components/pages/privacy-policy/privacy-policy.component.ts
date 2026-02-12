import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCookieService } from '../../../services/cookie.service';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './privacy-policy.component.html'
})
export class PrivacyPolicyComponent implements OnInit {
  private cookieService = inject(AppCookieService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(
      'Polityka Prywatności',
      'Zasady przetwarzania danych osobowych i wykorzystania plików cookies w serwisie kalkb2b.pl. Dowiedz się, jak chronimy Twoją prywatność.',
      '/polityka-prywatnosci'
    );
  }

  revokeConsent(): void {
    this.cookieService.delete('cookie_consent');
    this.cookieService.delete('b2b_calc_income');
    this.cookieService.delete('b2b_calc_vatRate');
    this.cookieService.delete('b2b_calc_taxForm');
    this.cookieService.delete('b2b_calc_zusType');
    this.cookieService.delete('b2b_calc_hasSickness');
    this.cookieService.delete('b2b_calc_expenses');
    window.location.reload();
  }
}
