import {Injectable} from "@angular/core";
import {ZUS_2026} from "../../models/zus-2026";

@Injectable({ providedIn: 'root' })
export class SocialContributionsService {
    calculate(zusType: string, hasSickness: boolean) {
        let socialAmount = 0;
        let fp = 0;
        let baseSocial = 0;
        let sicknessContribution = 0;

        if (zusType === 'PELNY') {
            baseSocial = ZUS_2026.BIG_ZUS.SOCIAL;
            fp = ZUS_2026.BIG_ZUS.FP
            sicknessContribution = hasSickness ? ZUS_2026.BIG_ZUS.SICKNESS : 0;
            socialAmount = baseSocial + sicknessContribution;
        } else if (zusType === 'MALY') {
            baseSocial = ZUS_2026.SMALL_ZUS.SOCIAL;
            sicknessContribution = hasSickness ? ZUS_2026.SMALL_ZUS.SICKNESS : 0;
            socialAmount = baseSocial + sicknessContribution;
        } else if (zusType === 'ULGA') {
            socialAmount = 0;
        }

        return {
            socialAmount,
            fp,
            baseSocial,
            sicknessContribution
        };
    }
}