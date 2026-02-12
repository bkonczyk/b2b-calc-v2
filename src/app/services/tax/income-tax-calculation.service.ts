import {inject, Injectable} from '@angular/core';
import {RyczaltTaxService} from "./ryczalt-tax.service";
import {LiniowyTaxService} from "./liniowy-tax.service";
import {SkalaTaxService} from "./skala-tax.service"; // Import

@Injectable({
    providedIn: 'root',
})
export class IncomeTaxCalculationService {
    private ryczaltService = inject(RyczaltTaxService);
    private liniowyService = inject(LiniowyTaxService);
    private skalaService = inject(SkalaTaxService);

    calculate(income: number, totalExpensesNet: number, socialDeductible: number, healthAmount: number, taxForm: string) {
        if (taxForm.startsWith('RYCZALT')) {
            return this.ryczaltService.calculate(income, socialDeductible, healthAmount, taxForm);
        } else if (taxForm === 'LINIOWY') {
            return this.liniowyService.calculate(income, totalExpensesNet, socialDeductible, healthAmount);
        } else if (taxForm === 'SKALA') {
            return this.skalaService.calculate(income, totalExpensesNet, socialDeductible);
        }
        return 0;
    }
}