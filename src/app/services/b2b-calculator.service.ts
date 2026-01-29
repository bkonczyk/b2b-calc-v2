// b2b-calculator.service.ts
import {Injectable, signal, computed} from '@angular/core';
import {Expense, TAX_FORM_OPTIONS} from '../models/b2b-types';
import {ZUS_2025} from '../models/zus-2025';

@Injectable({
    providedIn: 'root',
})
export class B2bCalculatorService {
    readonly income = signal(25000); // Przychód netto
    readonly vatRate = signal(23);
    readonly taxForm = signal('RYCZALT_12'); // RYCZALT_X, SKALA, LINIOWY
    readonly zusType = signal('PELNY'); // PELNY, MALY, ULGA
    readonly hasSickness = signal(false);
    readonly expenses = signal<Expense[]>([
        {id: 1, name: 'Biuro rachunkowe', net: 200, vat: 23},
        {id: 2, name: 'Telefon', net: 50, vat: 23},
    ]);

    // Główna logika obliczeniowa
    readonly results = computed(() => {
        // 1. Pobranie wartości ze stanu
        const inc = this.income();
        const vat = this.vatRate();
        const form = this.taxForm();
        const zus = this.zusType();
        const sickness = this.hasSickness();
        const exps = this.expenses();

        // 2. Obliczenia VAT (Faktura sprzedażowa)
        const isVatPayer = vat > 0; // Uproszczenie: jeśli stawka > 0, to vatowiec
        const vatAmount = (inc * vat) / 100;
        const grossTotal = inc + vatAmount;

        // 3. Przetwarzanie kosztów
        // Jeśli nie jesteś VATowcem, kwota brutto z faktury kosztowej jest Twoim kosztem (KUP)
        const totalExpensesNet = exps.reduce((sum, e) => {
            const expenseCost = isVatPayer ? e.net : e.net + (e.net * e.vat / 100);
            return sum + expenseCost;
        }, 0);

        // VAT do odliczenia (tylko dla VATowców)
        const totalExpensesVat = isVatPayer ? exps.reduce((sum, e) => sum + (e.net * e.vat) / 100, 0) : 0;
        const vatToPay = Math.max(0, vatAmount - totalExpensesVat);

        // 4. Obliczenie składek ZUS Społecznego
        let socialZusAmount = 0; // To co przelewamy do ZUS
        let socialZusDeductible = 0; // To co odejmujemy od podstawy podatku
        let fp = 0;

        if (zus === 'PELNY') {
            const baseSocial = ZUS_2025.BIG_ZUS.SOCIAL;
            fp = ZUS_2025.BIG_ZUS.FP;
            const sicknessContribution = sickness ? ZUS_2025.BIG_ZUS.SICKNESS : 0;

            socialZusAmount = baseSocial + fp + sicknessContribution;

            // Na ryczałcie FP nie pomniejsza przychodu (bo nie jest społecznym, tylko funduszem celowym - kosztem).
            // Na zasadach ogólnych (Skala/Liniowy) FP jest kosztem, więc można go odliczyć.
            if (form.startsWith('RYCZALT')) {
                socialZusDeductible = baseSocial + sicknessContribution;
            } else {
                socialZusDeductible = socialZusAmount; // Traktujemy FP jako odliczenie dla uproszczenia (KUP)
            }

        } else if (zus === 'MALY') {
            const baseSocial = ZUS_2025.SMALL_ZUS.SOCIAL;
            // Mały ZUS nie płaci FP
            const sicknessContribution = sickness ? ZUS_2025.SMALL_ZUS.SICKNESS : 0;

            socialZusAmount = baseSocial + sicknessContribution;
            socialZusDeductible = socialZusAmount;

        } else if (zus === 'ULGA') {
            // Tylko zdrowotna
            socialZusAmount = 0;
            socialZusDeductible = 0;
        }

        // 5. Obliczenie Składki Zdrowotnej
        // UWAGA: Podstawa zdrowotnej zależy od formy opodatkowania!
        let healthZus = 0;
        const minHealthZus = ZUS_2025.HEALTH_ZUS.MINIMAL;

        // Podstawa dla Skali/Liniowego: Dochód - Społeczne
        const incomeBasedBase = Math.max(0, inc - totalExpensesNet - socialZusDeductible);

        if (form === 'SKALA') {
            // 9% od dochodu
            healthZus = Math.max(minHealthZus, incomeBasedBase * 0.09);
        } else if (form === 'LINIOWY') {
            // 4.9% od dochodu
            healthZus = Math.max(minHealthZus, incomeBasedBase * 0.049);
        } else if (form.startsWith('RYCZALT')) {
            // Ryczałt: Progi od przychodu rocznego (szacunek x12)
            // Do limitu wlicza się przychód pomniejszony o społeczne
            const annualRevenue = (inc * 12) - (socialZusDeductible * 12);

            if (annualRevenue <= 60000) {
                healthZus = ZUS_2025.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.LOW;
            } else if (annualRevenue <= 300000) {
                healthZus = ZUS_2025.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.MEDIUM;
            } else {
                healthZus = ZUS_2025.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.HIGH;
            }
        }

        // 6. Obliczenie Podatku Dochodowego (PIT)
        let incomeTax = 0;
        const selectedTaxOption = TAX_FORM_OPTIONS.find(opt => opt.key === form);
        const taxRate = selectedTaxOption?.rate ?? 0.12;

        if (form.startsWith('RYCZALT')) {
            // Podstawa: Przychód - ZUS Społeczny - 50% Zapłaconej Zdrowotnej
            const taxBase = Math.round(Math.max(0, inc - socialZusDeductible - (0.5 * healthZus)));
            incomeTax = Math.round(taxBase * taxRate);

        } else if (form === 'LINIOWY') {
            // Podstawa: Dochód - Składka Zdrowotna (do limitu)
            // Limit roczny / 12 (symulacja miesięczna)
            const monthlyHealthDedLimit = ZUS_2025.HEALTH_ZUS.DEDUCTION_LIMIT_LINIOWY / 12;
            const deductibleHealth = Math.min(healthZus, monthlyHealthDedLimit);

            const taxBase = Math.round(Math.max(0, inc - totalExpensesNet - socialZusDeductible - deductibleHealth));
            incomeTax = Math.round(taxBase * 0.19); // 19% stałe

        } else if (form === 'SKALA') {
            // Podstawa: Dochód (Zdrowotna NIE JEST odliczana)
            const taxBase = Math.round(Math.max(0, inc - totalExpensesNet - socialZusDeductible));

            // Progi podatkowe (Skala miesięczna)
            // Próg: 120,000 zł rocznie -> 10,000 zł miesięcznie
            // Kwota zmniejszająca: 3600 zł rocznie -> 300 zł miesięcznie
            if (taxBase <= 10000) {
                incomeTax = Math.round(Math.max(0, (taxBase * 0.12) - 300));
            } else {
                const baseTax = (10000 * 0.12) - 300; // Podatek z pierwszego progu
                const excessTax = (taxBase - 10000) * 0.32; // 32% od nadwyżki
                incomeTax = Math.round(baseTax + excessTax);
            }
        }

        const totalZus = socialZusAmount + healthZus;

        // 7. Wynik "Na rękę"
        // Przychód - VAT(jeśli płatnik) - Koszty(Brutto) - Pełny ZUS - PIT
        // Uproszczony wzór: (Przychód Netto - Podatki - Koszty Netto - ZUS)
        // Musimy odjąć totalExpensesNet, bo to realny wydatek z kieszeni przedsiębiorcy
        const netTakeHome = inc - incomeTax - totalZus - totalExpensesNet;

        return {
            grossTotal,
            vatAmount,
            vatToPay,
            socialZus: socialZusAmount,
            healthZus,
            totalZus,
            incomeTax,
            totalExpensesNet,
            totalExpensesVat,
            netTakeHome
        };
    });

    // Metody zmieniające stan
    setIncome(val: number) { this.income.set(val); }
    setVatRate(val: number) { this.vatRate.set(val); }
    setTaxForm(val: string) { this.taxForm.set(val); }
    setZusType(val: string) { this.zusType.set(val); }
    toggleSickness() { this.hasSickness.update(v => !v); }

    addExpense() {
        this.expenses.update(prev => [...prev, {id: Date.now(), name: 'Nowy koszt', net: 0, vat: 23}]);
    }

    updateExpense(id: number, field: keyof Expense, value: any) {
        this.expenses.update(prev => prev.map(e => e.id === id ? {...e, [field]: value} : e));
    }

    removeExpense(id: number) {
        this.expenses.update(prev => prev.filter(e => e.id !== id));
    }
}