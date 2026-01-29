import {Component, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ParametersFormComponent } from './components/calculator/parameters-form/parameters-form.component';
import { ResultsSummaryComponent } from './components/calculator/results-summary/results-summary.component';
import { DetailedBreakdownComponent } from './components/calculator/detailed-breakdown/detailed-breakdown.component';
import { ExpensesManagerComponent } from './components/calculator/expenses-manager/expenses-manager.component';
import { CookieConsentComponent } from './components/layout/cookie-consent/cookie-consent.component';
import { PrivacyPolicyComponent } from './components/layout/privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ParametersFormComponent,
    ResultsSummaryComponent,
    DetailedBreakdownComponent,
    ExpensesManagerComponent,
    CookieConsentComponent,
    PrivacyPolicyComponent
  ],
  templateUrl: './app.component.html', // Używamy zewnętrznego pliku
  encapsulation: ViewEncapsulation.None,
  styles: [`
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  isPrivacyPolicyVisible = false;

  togglePrivacyPolicy(isVisible: boolean) {
    this.isPrivacyPolicyVisible = isVisible;
  }
}
