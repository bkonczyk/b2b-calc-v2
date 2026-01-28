import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Potrzebne dla ngClass itp.
import { B2bCalculatorService } from '../../../services/b2b-calculator.service';
import { TAX_FORM_OPTIONS, ZUS_OPTIONS } from '../../../models/b2b-types';

@Component({
  selector: 'app-parameters-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parameters-form.component.html', // Odwołanie do pliku HTML
  styleUrl: './parameters-form.component.scss'
})
export class ParametersFormComponent {
  service = inject(B2bCalculatorService);
  taxOptions = TAX_FORM_OPTIONS;
  zusOptions = ZUS_OPTIONS;

  getValue(event: Event): number { return Number((event.target as HTMLInputElement).value); }
  getStringValue(event: Event): string { return (event.target as HTMLSelectElement).value; }
}