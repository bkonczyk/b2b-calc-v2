import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Potrzebne dla ngClass itp.
import { B2bCalculatorService } from '../../../services/b2b-calculator.service';
import { TAX_FORM_OPTIONS, ZUS_OPTIONS } from '../../../models/b2b-types';


@Component({
  selector: 'app-results-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-summary.component.html',
  styleUrl: './results-summary.component.scss',
})
export class ResultsSummaryComponent {
  service = inject(B2bCalculatorService);
}