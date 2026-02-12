import {Injectable} from '@angular/core';
import {ZUS_2026} from "../../models/zus-2026";

@Injectable({
    providedIn: 'root',
})

export class LiniowyTaxService {

    calculate(income: number, expenses: number, socialDeductible: number, healthAmount: number): number {
        const monthlyHealthDedLimit = ZUS_2026.HEALTH_ZUS.DEDUCTION_LIMIT_LINIOWY / 12;
        const deductibleHealth = Math.min(healthAmount, monthlyHealthDedLimit);
        const taxBase = Math.round(Math.max(0, income - expenses - socialDeductible - deductibleHealth));
        return Math.round(taxBase * 0.19);
    }
}