import {Injectable} from "@angular/core";
import {ZUS_2026} from "../../models/zus-2026";

@Injectable({providedIn: 'root'})
export class SkalaHealthService {
    calculate(income: number, expensesNet: number, socialDeductible: number): number {
        const incomeBasedBase = Math.max(0, income - expensesNet - socialDeductible);
        const minHealthZus = ZUS_2026.HEALTH_ZUS.MINIMAL;
        return Math.max(minHealthZus, incomeBasedBase * 0.09);
    }
}