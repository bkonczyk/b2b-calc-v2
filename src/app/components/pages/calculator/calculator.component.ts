import { Component, OnInit, inject } from '@angular/core';
import { ParametersFormComponent } from '../../calculator/parameters-form/parameters-form.component';
import { ResultsSummaryComponent } from '../../calculator/results-summary/results-summary.component';
import { DetailedBreakdownComponent } from '../../calculator/detailed-breakdown/detailed-breakdown.component';
import { ExpensesManagerComponent } from '../../calculator/expenses-manager/expenses-manager.component';
import { SeoService } from '../../../services/seo.service';

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
export class CalculatorComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(
      'Kalkulator B2B - Oblicz Zysk Netto i Podatki',
      'Darmowy kalkulator B2B dla samozatrudnionych na 2026 rok. Oblicz składki ZUS, podatek dochodowy (Ryczałt, Liniowy, Skala) oraz realny zysk netto "na rękę".',
      '/'
    );
  }
}
