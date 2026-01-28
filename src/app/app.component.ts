import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ParametersFormComponent } from './components/calculator/parameters-form/parameters-form.component';
import { ResultsSummaryComponent } from './components/calculator/results-summary/results-summary.component';
import { DetailedBreakdownComponent } from './components/calculator/detailed-breakdown/detailed-breakdown.component';
import { ExpensesManagerComponent } from './components/calculator/expenses-manager/expenses-manager.component';

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
    DetailedBreakdownComponent,
    ExpensesManagerComponent,
    FooterComponent,
    NavbarComponent,
    ResultsSummaryComponent
  ],
  templateUrl: './app.component.html', // Używamy zewnętrznego pliku
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}