import {Injectable} from "@angular/core";
import {ZUS_2026} from "../../models/zus-2026";

@Injectable({providedIn: 'root'})
export class RyczaltHealthService {
    calculate(income: number, socialDeductible: number): number {
        const annualRevenue = (income * 12) - (socialDeductible * 12);
        if (annualRevenue <= 60000) {
            return ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.LOW;
        } else if (annualRevenue <= 300000) {
            return ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.MEDIUM;
        } else {
            return ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.HIGH;
        }
    }
}