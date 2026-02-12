import {Injectable} from '@angular/core';
import {Expense} from '../models/b2b-types';

@Injectable({
    providedIn: 'root',
})
export class ExpensesCalculationService {
    calculate(expenses: Expense[], isVatPayer: boolean) {
        return expenses.reduce((acc, e) => {
            let deductibleVat = 0;
            let expenseCostPIT = 0;
            let realCost = 0;

            const expenseVatAmount = (e.net * e.vat) / 100;
            const grossAmount = e.net + expenseVatAmount;

            if (isVatPayer) {
                // VAT PAYER LOGIC
                if (e.carType === 'mixed') {
                    deductibleVat = expenseVatAmount * 0.5;
                    const costBase = e.net + (expenseVatAmount * 0.5);
                    expenseCostPIT = costBase * 0.75;
                    realCost = e.net + (expenseVatAmount - deductibleVat);
                } else if (e.carType === 'private') {
                    deductibleVat = expenseVatAmount * 0.5;
                    const costBase = e.net + (expenseVatAmount * 0.5);
                    expenseCostPIT = costBase * 0.20;
                    realCost = e.net + (expenseVatAmount - deductibleVat);
                } else {
                    deductibleVat = expenseVatAmount;
                    expenseCostPIT = e.net;
                    realCost = e.net; 
                }
            } else {
                // NON-VAT PAYER LOGIC
                deductibleVat = 0;
                realCost = grossAmount;
                
                if (e.carType === 'mixed') {
                    expenseCostPIT = grossAmount * 0.75;
                } else if (e.carType === 'private') {
                    expenseCostPIT = grossAmount * 0.20;
                } else {
                    expenseCostPIT = grossAmount;
                }
            }

            return {
                totalVatDeduction: acc.totalVatDeduction + deductibleVat,
                totalPitCost: acc.totalPitCost + expenseCostPIT,
                totalRealCost: acc.totalRealCost + realCost
            };
        }, { totalVatDeduction: 0, totalPitCost: 0, totalRealCost: 0 });
    }
}