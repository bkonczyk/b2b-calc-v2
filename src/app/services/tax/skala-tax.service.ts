import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class SkalaTaxService {
    calculate(income: number, expenses: number, socialDeductible: number): number {
        const taxBase = Math.round(Math.max(0, income - expenses - socialDeductible));
        if (taxBase <= 10000) {
            return Math.round(Math.max(0, (taxBase * 0.12) - 300));
        } else {
            const baseTax = (10000 * 0.12) - 300;
            const excessTax = (taxBase - 10000) * 0.32;
            return Math.round(baseTax + excessTax);
        }
    }
}