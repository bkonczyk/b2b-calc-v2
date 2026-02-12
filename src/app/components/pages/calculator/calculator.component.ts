import { Component } from '@angular/core';
import { ParametersFormComponent } from '../../calculator/parameters-form/parameters-form.component';
import { ResultsSummaryComponent } from '../../calculator/results-summary/results-summary.component';
import { DetailedBreakdownComponent } from '../../calculator/detailed-breakdown/detailed-breakdown.component';
import { ExpensesManagerComponent } from '../../calculator/expenses-manager/expenses-manager.component';

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [
    ParametersFormComponent,
    ResultsSummaryComponent,
    DetailedBreakdownComponent,
    ExpensesManagerComponent
  ],
  templateUrl: './calculator.component.html'
})
export class CalculatorComponent {}
