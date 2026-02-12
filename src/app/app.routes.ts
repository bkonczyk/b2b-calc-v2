import { Routes } from '@angular/router';
import { CalculatorComponent } from './components/pages/calculator/calculator.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './components/pages/terms-of-service/terms-of-service.component';

export const routes: Routes = [
    { path: '', component: CalculatorComponent },
    { path: 'polityka-prywatnosci', component: PrivacyPolicyComponent },
    { path: 'regulamin', component: TermsOfServiceComponent },
    { path: '**', redirectTo: '' }
];
