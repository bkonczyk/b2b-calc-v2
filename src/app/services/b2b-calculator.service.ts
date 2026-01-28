import {Injectable, signal, computed} from '@angular/core';
import {Expense} from '../models/b2b-types';

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
        {id: 1, name: 'Biuro / Coworking', net: 1500, vat: 23},
        {id: 2, name: 'Internet i Telefon', net: 150, vat: 23},
    ]);

    // Logika obliczeniowa (Computed)
    readonly results = computed(() => {
        const inc = this.income();
        const vat = this.vatRate();
        const form = this.taxForm();
        const zus = this.zusType();
        const sickness = this.hasSickness();
        const exps = this.expenses();

        const vatAmount = (inc * vat) / 100;
        const grossTotal = inc + vatAmount;

        // Stałe ZUS 2025 (Szacunkowe)
        const BASE_SOCIAL = 1600.32;
        const BASE_SMALL = 400.00;
        const FP_RATE = 125.40;

        let socialZus = 0;
        let fpZus = 0;

        if (zus === 'PELNY') {
            socialZus = BASE_SOCIAL;
            fpZus = FP_RATE;
        } else if (zus === 'MALY') {
            socialZus = BASE_SMALL;
        }

        if (sickness) socialZus += 100;

        // Składka zdrowotna
        let healthZus = 0;
        if (form === 'SKALA') {
            healthZus = inc * 0.09;
        } else if (form === 'LINIOWY') {
            healthZus = inc * 0.049;
        } else {
            // Ryczałt (uproszczone progi)
            if (inc <= 5000) healthZus = 419.46;
            else if (inc <= 25000) healthZus = 699.11;
            else healthZus = 1258.39;
        }

        const totalExpensesNet = exps.reduce((sum, e) => sum + e.net, 0);
        const totalExpensesVat = exps.reduce((sum, e) => sum + (e.net * e.vat) / 100, 0);

        // Podatek dochodowy
        let incomeTax = 0;
        const taxableBase = inc - (form.startsWith('RYCZALT') ? 0 : (socialZus + totalExpensesNet));

        if (form.startsWith('RYCZALT')) {
            const rate = parseFloat(form.split('_')[1]) / 100;
            incomeTax = inc * rate;
        } else if (form === 'LINIOWY') {
            incomeTax = Math.max(0, taxableBase * 0.19);
        } else {
            const monthlyAllowance = 2500;
            incomeTax = Math.max(0, (taxableBase * 0.12) - monthlyAllowance);
        }

        const totalZus = socialZus + healthZus + fpZus;
        const netTakeHome = inc - totalZus - incomeTax - totalExpensesNet;

        return {
            grossTotal,
            vatAmount,
            socialZus,
            healthZus,
            fpZus,
            totalZus,
            incomeTax,
            totalExpensesNet,
            totalExpensesVat,
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