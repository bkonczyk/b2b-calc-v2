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
    if (!this.cookieService.check('cookie_consent')) {
      this.isVisible = true;
    }
  }

  acceptCookies(): void {
    this.cookieService.set('cookie_consent', 'true');
    this.isVisible = false;
  }

  declineCookies(): void {
    // W przypadku odmowy, możemy np. zapisać informację o odmowie, 
    // ale zgodnie z RODO/GDPR zazwyczaj po prostu nie zapisujemy zgody 
    // i nie uruchamiamy skryptów śledzących. 
    // Tutaj dla uproszczenia po prostu zamykamy okno, 
    // ale można też zapisać 'false' w cookie, żeby nie pytać ponownie przez sesję.
    // Przyjmijmy, że zapisujemy 'false' na krótki czas lub wcale.
    // Tutaj zapiszemy 'false' aby nie pytać ciągle.
    this.cookieService.set('cookie_consent', 'false');
    this.isVisible = false;
  }
}
