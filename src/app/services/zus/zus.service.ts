import {inject, Injectable} from "@angular/core";
import {SocialContributionsService} from "./social-contribution.service";
import {RyczaltHealthService} from "./ryczalt-health.service";
import {LiniowyHealthService} from "./liniowy-health.service";
import {SkalaHealthService} from "./skala-health.service";

@Injectable({providedIn: 'root'})
export class ZusService {
    private socialService = inject(SocialContributionsService);
    private ryczaltHealth = inject(RyczaltHealthService);
    private liniowyHealth = inject(LiniowyHealthService);
    private skalaHealth = inject(SkalaHealthService);

    calculate(income: number, expensesNet: number, taxForm: string, zusType: string, hasSickness: boolean) {
        // 1. Calculate Social Contributions (Common Logic)
        const socialCalc = this.socialService.calculate(zusType, hasSickness);

        let socialDeductible = 0;
        // Deductible Logic depends on Tax Form (FP is not deductible in Ryczalt)
        if (taxForm.startsWith('RYCZALT')) {
            socialDeductible = socialCalc.socialAmount;
        } else {
            socialDeductible = socialCalc.socialAmount + socialCalc.fp;
        }

        // 2. Calculate Health Contribution (Strategy Pattern)
        let healthAmount = 0;

        if (taxForm === 'SKALA') {
            healthAmount = this.skalaHealth.calculate(income, expensesNet, socialDeductible);
        } else if (taxForm === 'LINIOWY') {
            healthAmount = this.liniowyHealth.calculate(income, expensesNet, socialDeductible);
        } else if (taxForm.startsWith('RYCZALT')) {
            healthAmount = this.ryczaltHealth.calculate(income, socialDeductible);
        }

        const totalZus = socialCalc.socialAmount + socialCalc.fp + healthAmount;

        return {
            socialAmount: socialCalc.socialAmount,
            socialDeductible,
            healthAmount,
            totalZus,
            fp: socialCalc.fp
        };
    }
}