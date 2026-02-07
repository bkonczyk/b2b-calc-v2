import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common'; // Potrzebne dla ngClass itp.
import {B2bCalculatorService} from '../../../services/b2b-calculator.service';
import {CarUsageType} from "../../../models/b2b-types";

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

    // SAMOCHOD: Logika przełączania trybów (cykliczna)
    toggleCarType(id: number, currentType: CarUsageType | undefined) {
        const nextType: CarUsageType =
            currentType === 'mixed' ? 'private' :
                currentType === 'private' ? 'none' : 'mixed';

        this.service.updateExpense(id, 'carType', nextType);
    }

    // SAMOCHOD: Teksty pomocnicze do tooltipa
    getCarTooltip(type: CarUsageType | undefined): string {
        const isRyczalt = this.service.taxForm().startsWith('RYCZALT');

        switch (type) {
            case 'mixed':
                return isRyczalt ? 'Mieszany (Tylko 50% VAT)' : 'Mieszany (75% PIT, 50% VAT)';
            case 'private':
                return isRyczalt ? 'Prywatny (Tylko 50% VAT)' : 'Prywatny (20% PIT, 50% VAT)';
            default: return 'Standardowy koszt';
        }
    }
}