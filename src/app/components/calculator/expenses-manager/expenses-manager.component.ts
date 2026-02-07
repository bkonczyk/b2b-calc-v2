import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common'; // Potrzebne dla ngClass itp.
import {B2bCalculatorService} from '../../../services/b2b-calculator.service';

@Component({
    selector: 'app-expenses-manager',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './expenses-manager.component.html',
    styleUrl: './expenses-manager.component.scss',
})
export class ExpensesManagerComponent {
    service = inject(B2bCalculatorService);

    getVal(e: Event) {
        return (e.target as HTMLInputElement).value;
    }

    getNum(e: Event) {
        const input = e.target as HTMLInputElement;
        let value = Number(input.value);
        if (value < 0) {
            value = Math.abs(value);
            input.value = value.toString();
        }
        return value;
    }
}