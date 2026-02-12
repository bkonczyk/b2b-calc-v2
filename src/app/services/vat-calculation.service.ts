import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})

@Injectable({providedIn: 'root'})
export class VatCalculationService {
    calculate(income: number, vatRate: number, expensesVatDeduction: number) {
        // 1. Obliczamy surową kwotę VAT
        const rawVatAmount = (income * vatRate) / 100;

        // 2. Zaokrąglamy VAT do 2 miejsc po przecinku (zgodnie z zasadami księgowymi)
        const vatAmount = this.roundCurrency(rawVatAmount);

        // 3. Brutto to Netto + Zaokrąglony VAT
        const grossTotal = this.roundCurrency(income + vatAmount);

        // 4. VAT do zapłaty: (Zaokrąglony VAT - Odliczenia), ale nie mniej niż 0
        // Zakładamy, że expensesVatDeduction wchodzi już jako poprawna kwota walutowa
        const vatToPay = Math.max(0, Math.round(vatAmount - expensesVatDeduction));

        return {
            grossTotal,
            vatAmount,
            vatToPay
        };
    }

    /**
     * Zaokrągla liczbę do 2 miejsc po przecinku (do groszy).
     * Używa Number.EPSILON, aby naprawić błędy float w JS (np. 1.005).
     */
    private roundCurrency(value: number): number {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
}