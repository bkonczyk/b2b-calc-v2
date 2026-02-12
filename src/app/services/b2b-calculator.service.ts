// b2b-calculator.service.ts
import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {Expense} from '../models/b2b-types';
import {AppCookieService} from './cookie.service';
import {ExpensesCalculationService} from "./expenses-calculation.service";
import {IncomeTaxCalculationService} from "./tax/income-tax-calculation.service";
import {VatCalculationService} from "./vat-calculation.service";
import {ZusService} from "./zus/zus.service"; // Import

const COOKIE_PREFIX = 'b2b_calc_';

@Injectable({
    providedIn: 'root',
})
export class B2bCalculatorService {
    private cookie = inject(AppCookieService);

    private zusService = inject(ZusService);
    private expensesService = inject(ExpensesCalculationService);
    private incomeTaxService = inject(IncomeTaxCalculationService);
    private vatService = inject(VatCalculationService);

    // Sygnały z wartościami odczytanymi z cookies lub domyślnymi
    readonly income = signal(this.cookie.consentGranted() ? Number(this.cookie.get(COOKIE_PREFIX + 'income') || 25000) : 25000);
    readonly vatRate = signal(this.cookie.consentGranted() ? Number(this.cookie.get(COOKIE_PREFIX + 'vatRate') || 23) : 23);
    readonly taxForm = signal(this.cookie.consentGranted() ? this.cookie.get(COOKIE_PREFIX + 'taxForm') || 'RYCZALT_12' : 'RYCZALT_12');
    readonly zusType = signal(this.cookie.consentGranted() ? this.cookie.get(COOKIE_PREFIX + 'zusType') || 'PELNY' : 'PELNY');
    readonly hasSickness = signal(this.cookie.consentGranted() ? JSON.parse(this.cookie.get(COOKIE_PREFIX + 'hasSickness') || 'false') : false);
    readonly expenses = signal<Expense[]>(this.cookie.consentGranted() ? JSON.parse(this.cookie.get(COOKIE_PREFIX + 'expenses') || '[]') : []);

    constructor() {
        // Efekt do automatycznego zapisu w cookies przy zmianie wartości, jeśli jest zgoda
        effect(() => {
            if (this.cookie.consentGranted()) {
                this.cookie.set(COOKIE_PREFIX + 'income', this.income().toString());
                this.cookie.set(COOKIE_PREFIX + 'vatRate', this.vatRate().toString());
                this.cookie.set(COOKIE_PREFIX + 'taxForm', this.taxForm());
                this.cookie.set(COOKIE_PREFIX + 'zusType', this.zusType());
                this.cookie.set(COOKIE_PREFIX + 'hasSickness', JSON.stringify(this.hasSickness()));
                this.cookie.set(COOKIE_PREFIX + 'expenses', JSON.stringify(this.expenses()));
            }
        });

        // Ustaw domyślne koszty, jeśli nie ma zgody lub lista jest pusta
        if (this.expenses().length === 0) {
            this.expenses.set([
                {id: 1, name: 'Biuro rachunkowe', net: 200, vat: 23, carType: 'none'},
                {id: 2, name: 'Telefon', net: 50, vat: 23, carType: 'none'},
            ]);
        }
    }

    // Główna logika obliczeniowa
    readonly results = computed(() => {
        // ... (reszta kodu bez zmian)
        const inc = this.income();
        const vatRate = this.vatRate();
        const form = this.taxForm();
        const zusType = this.zusType();
        const hasSickness = this.hasSickness();
        const expenses = this.expenses();

        // 1. Calculate Expenses & Deductions
        const expensesCalc = this.expensesService.calculate(expenses, vatRate > 0);

        // 2. Calculate VAT
        const vatCalc = this.vatService.calculate(inc, vatRate, expensesCalc.totalVatDeduction);

        // 3. Calculate ZUS
        // Note: ZUS health calc usually needs expensesNet for "Scale/Linear" income base,
        // but for Ryczałt it's revenue based. The service handles this logic.
        const zusCalc = this.zusService.calculate(inc, expensesCalc.totalPitCost, form, zusType, hasSickness);

        // 4. Calculate Income Tax (PIT)
        const incomeTax = this.incomeTaxService.calculate(
            inc,
            expensesCalc.totalPitCost,
            zusCalc.socialDeductible,
            zusCalc.healthAmount,
            form
        );

        const netTakeHome = inc - incomeTax - zusCalc.totalZus - expensesCalc.totalRealCost;


        return {
            grossTotal: vatCalc.grossTotal,
            vatAmount: vatCalc.vatAmount,
            vatToPay: vatCalc.vatToPay,
            socialZus: zusCalc.socialAmount,
            healthZus: zusCalc.healthAmount,
            totalZus: zusCalc.totalZus,
            incomeTax,
            totalExpensesDeductible: expensesCalc.totalPitCost,
            totalRealExpenses: expensesCalc.totalRealCost,
            totalExpensesVat: expensesCalc.totalVatDeduction,
            netTakeHome
        };
    });

    // Metody zmieniające stan
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
        this.expenses.update(prev => [...prev, {id: Date.now(), name: 'Nowy koszt', net: 0, vat: 23, carType: 'none'}]);
    }

    updateExpense(id: number, field: keyof Expense, value: any) {
        this.expenses.update(prev => prev.map(e => e.id === id ? {...e, [field]: value} : e));
    }

    removeExpense(id: number) {
        this.expenses.update(prev => prev.filter(e => e.id !== id));
    }
}
