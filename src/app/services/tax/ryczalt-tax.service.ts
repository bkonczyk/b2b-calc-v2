import {Injectable} from '@angular/core';
import {TAX_FORM_OPTIONS} from '../../models/b2b-types';

@Injectable({
    providedIn: 'root',
})
export class RyczaltTaxService {

    calculate(income: number, socialDeductible: number, healthAmount: number, taxForm: string): number {
        const selectedTaxOption = TAX_FORM_OPTIONS.find(opt => opt.key === taxForm);
        const taxRate = selectedTaxOption?.rate ?? 0.12;
        const taxBase = Math.round(Math.max(0, income - socialDeductible - (0.5 * healthAmount)));
        return Math.round(taxBase * taxRate);
    }
}