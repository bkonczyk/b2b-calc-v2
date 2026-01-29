import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCookieService } from '../../../services/cookie.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  @Input() isVisible: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  private cookieService = inject(AppCookieService);

  closePolicy(): void {
    this.closeEvent.emit();
  }

  revokeConsent(): void {
    // Usuń wszystkie cookies związane z aplikacją
    // W tym przypadku usuwamy 'cookie_consent' i wszystkie cookies z prefixem 'b2b_calc_'
    this.cookieService.delete('cookie_consent');
    
    // Można by iterować po wszystkich cookies i usuwać te z prefixem,
    // ale dla uproszczenia zakładamy, że te dwa są kluczowe.
    // W bardziej złożonej aplikacji, lista cookies do usunięcia byłaby bardziej rozbudowana.
    this.cookieService.delete('b2b_calc_income');
    this.cookieService.delete('b2b_calc_vatRate');
    this.cookieService.delete('b2b_calc_taxForm');
    this.cookieService.delete('b2b_calc_zusType');
    this.cookieService.delete('b2b_calc_hasSickness');
    this.cookieService.delete('b2b_calc_expenses');

    // Po usunięciu cookies, warto odświeżyć stronę, aby zmiany weszły w życie
    // i np. ponownie wyświetlić okienko zgody na cookies.
    window.location.reload();
  }
}
