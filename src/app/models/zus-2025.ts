export const ZUS_2025 = {
    BIG_ZUS: {
        SOCIAL: 1518.98, // Emerytalna + Rentowa + Wypadkowa + Fundusz Pracy
        SICKNESS: 127.49,
        FP: 127.49,
    },
    SMALL_ZUS: {
        SOCIAL: 408.50, // Emerytalna + Rentowa + Wypadkowa
        SICKNESS: 34.30,
        FP: 0.00
    },
    HEALTH_ZUS: {
        MINIMAL: 381.78,
        DEDUCTION_LIMIT_LINIOWY: 11600,
        LUMP_SUM_THRESHOLDS: {
            LOW: 461.66,    // do 60 tys.
            MEDIUM: 769.43, // 60 - 300 tys.
            HIGH: 1384.97   // powyżej 300 tys.
        }
    }
};