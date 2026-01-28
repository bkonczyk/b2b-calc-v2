import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common'; // Potrzebne dla ngClass itp.
import {B2bCalculatorService} from '../../../services/b2b-calculator.service';
import {TAX_FORM_OPTIONS, ZUS_OPTIONS} from '../../../models/b2b-types';


@Component({
    selector: 'app-detailed-breakdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './detailed-breakdown.component.html',
    styleUrl: './detailed-breakdown.component.scss',
})
export class DetailedBreakdownComponent {
    service = inject(B2bCalculatorService);
}