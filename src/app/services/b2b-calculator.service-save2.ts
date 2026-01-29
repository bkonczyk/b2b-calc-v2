import {Injectable, signal, computed} from '@angular/core';
import {Expense, TAX_FORM_OPTIONS} from '../models/b2b-types';
import {ZUS_2025} from '../models/zus-2025';

@Injectable({
    providedIn: 'root',
})
export class B2bCalculatorService {
    readonly income = signal(25000);
    readonly vatRate = signal(23);
    readonly taxForm = signal('RYCZALT_12');
    readonly zusType = signal('PELNY');
    readonly hasSickness = signal(false);
    readonly expenses = signal<Expense[]>([
        {id: 1, name: 'Biuro rachunkowe', net: 200, vat: 23},
        {id: 2, name: 'Telefon', net: 50, vat: 23},
    ]);

    // Logika obliczeniowa (Computed)
    readonly results = computed(() => {
        const inc = this.income();
        const vat = this.vatRate();
        const form = this.taxForm();
        const zus = this.zusType();
        const sickness = this.hasSickness();
        const exps = this.expenses();

        const isVatPayer = vat > 0;
        const vatAmount = (inc * vat) / 100;
        const grossTotal = inc + vatAmount;

        let socialZus = 0;
        let fp = 0;

        if (zus === 'PELNY') {
            socialZus = ZUS_2025.BIG_ZUS.SOCIAL;
            fp = ZUS_2025.BIG_ZUS.FP;
            if (sickness) {
                socialZus += ZUS_2025.BIG_ZUS.SICKNESS;
            }
        } else if (zus === 'MALY') {
            socialZus = ZUS_2025.SMALL_ZUS.SOCIAL;
            fp = ZUS_2025.SMALL_ZUS.FP;
            if (sickness) {
                socialZus += ZUS_2025.SMALL_ZUS.SICKNESS;
            }
        } else if (zus === 'ULGA') {
            socialZus = 0;
        }

        // Składka zdrowotna 2025
        let healthZus = 0;
        const minHealthZus = ZUS_2025.HEALTH_ZUS.MINIMAL;

        if (form === 'SKALA') {
            healthZus = Math.max(minHealthZus, inc * 0.09);
        } else if (form === 'LINIOWY') {
            healthZus = Math.max(minHealthZus, inc * 0.049);
        } else if (form.startsWith('RYCZALT')) {
            const annualIncome = inc * 12;
            if (annualIncome <= 60000) {
                healthZus = ZUS_2025.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.LOW;
            } else if (annualIncome <= 300000) {
                healthZus = ZUS_2025.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.MEDIUM;
            } else {
                healthZus = ZUS_2025.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.HIGH;
            }
        }

        // Jeśli przedsiębiorca nie jest płatnikiem VAT, jego kosztem jest kwota brutto wydatków
        const totalExpensesNet = exps.reduce((sum, e) => {
            const expenseCost = isVatPayer ? e.net : e.net + (e.net * e.vat / 100);
            return sum + expenseCost;
        }, 0);
        
        // VAT od kosztów, który można odliczyć (tylko dla płatników VAT)
        const totalExpensesVat = isVatPayer ? exps.reduce((sum, e) => sum + (e.net * e.vat) / 100, 0) : 0;
        const vatToPay = vatAmount - totalExpensesVat;

        // Podatek dochodowy
        let incomeTax = 0;

        // Znajdź wybraną opcję podatkową, aby pobrać stawkę
        const selectedTaxOption = TAX_FORM_OPTIONS.find(opt => opt.key === form);
        const taxRate = selectedTaxOption?.rate;

        if (form.startsWith('RYCZALT')) {
            const rate = taxRate !== undefined ? taxRate : 0;
            const taxBase = Math.max(0, inc - (socialZus - fp) - 0.5 * healthZus);
            incomeTax = Math.round(taxBase * rate);
        } else if (form === 'LINIOWY') {
             const taxBase = Math.max(0, inc - totalExpensesNet - socialZus);
             const rate = taxRate !== undefined ? taxRate : 0.19;
            incomeTax = Math.round(taxBase * rate);
        } else if (form === 'SKALA') {
            const taxBase = Math.max(0, inc - totalExpensesNet - socialZus);
            if (taxBase <= 10000) {
                 incomeTax = Math.round(Math.max(0, (taxBase * 0.12) - 300));
            } else {
                const baseTax = (10000 * 0.12) - 300;
                const excessTax = (taxBase - 10000) * 0.32;
                incomeTax = Math.round(baseTax + excessTax);
            }
        }

        const totalZus = socialZus + healthZus;
        // Kwota "na rękę" jest liczona od przychodu netto, po odjęciu realnych kosztów i podatków
        const netTakeHome = inc - totalZus - incomeTax - totalExpensesNet;

        return {
            grossTotal,
            vatAmount,
            socialZus,
            healthZus,
            totalZus,
            incomeTax,
            totalExpensesNet,
            totalExpensesVat,
            vatToPay,
            netTakeHome
        };
    });

    // Metody zmieniające stan (Actions)
    setIncome(val: number) {
        this.income.set(val);
    }

    setVatRate(val: number) {
        this.vatRate.set(val);
    }

    setTaxForm(val: string) {
        this.taxForm.set(val);
    }

    setZusType(val: string) {
        this.zusType.set(val);
    }

    toggleSickness() {
        this.hasSickness.update(v => !v);
    }

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