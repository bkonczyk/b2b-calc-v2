// import { TestBed } from '@angular/core/testing';
// import { B2bCalculatorService } from './b2b-calculator.service';
// import { AppCookieService } from './cookie.service';
// import { signal } from '@angular/core';
// import { ZUS_2026 } from '../models/zus-2026';
// import { describe, it, expect, beforeEach, vi } from 'vitest';
//
// describe('B2bCalculatorService', () => {
//   let service: B2bCalculatorService;
//   let mockCookieService: any;
//
//   beforeEach(() => {
//     // Mockujemy AppCookieService używając vi.fn() z Vitest
//     mockCookieService = {
//       get: vi.fn().mockReturnValue(null), // Domyślnie brak zapisanych cookies
//       set: vi.fn(),
//       check: vi.fn().mockReturnValue(false),
//       consentGranted: signal(true) // Symulujemy, że zgoda jest udzielona
//     };
//
//     TestBed.configureTestingModule({
//       providers: [
//         B2bCalculatorService,
//         { provide: AppCookieService, useValue: mockCookieService }
//       ]
//     });
//
//     service = TestBed.inject(B2bCalculatorService);
//
//     // Resetujemy stan do czystej postaci przed każdym testem
//     service.expenses.set([]);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//
//   describe('Initialization & Defaults', () => {
//     it('should initialize with default values when no cookies are present', () => {
//       expect(service.income()).toBe(25000);
//       expect(service.vatRate()).toBe(23);
//       expect(service.taxForm()).toBe('RYCZALT_12');
//     });
//   });
//
//   describe('Calculations: Ryczałt (Lump Sum)', () => {
//     beforeEach(() => {
//       service.setTaxForm('RYCZALT_12');
//       service.setZusType('PELNY');
//       service.hasSickness.set(false);
//       service.expenses.set([]);
//     });
//
//     it('should calculate correct Net Take Home for Ryczałt 12%', () => {
//       const income = 10000;
//       service.setIncome(income);
//
//       const res = service.results();
//
//       // 1. ZUS Społeczny (Pełny, bez chorobowego)
//       const expectedSocialZus = ZUS_2026.BIG_ZUS.SOCIAL;
//       expect(res.socialZus).toBeCloseTo(expectedSocialZus, 2);
//
//       // 2. ZUS Zdrowotny
//       const expectedHealthZus = ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.MEDIUM;
//       expect(res.healthZus).toBe(expectedHealthZus);
//
//       // 3. Podatek
//       const deductibleSocial = ZUS_2026.BIG_ZUS.SOCIAL - ZUS_2026.BIG_ZUS.FP;
//       const taxBase = Math.round(income - deductibleSocial - (0.5 * expectedHealthZus));
//       const expectedTax = Math.round(taxBase * 0.12);
//       expect(res.incomeTax).toBe(expectedTax);
//
//       // 4. Wynik końcowy
//       const expectedNet = income - expectedTax - expectedSocialZus - expectedHealthZus;
//       expect(res.netTakeHome).toBeCloseTo(expectedNet, 2);
//     });
//   });
//
//   describe('Calculations: Podatek Liniowy (Linear)', () => {
//     beforeEach(() => {
//       service.setTaxForm('LINIOWY');
//       service.setZusType('ULGA');
//       service.expenses.set([]);
//     });
//
//     it('should calculate 19% tax and deduct health insurance up to limit', () => {
//       const income = 20000;
//       service.setIncome(income);
//
//       const res = service.results();
//
//       // Zdrowotna (4.9% od dochodu)
//       const expectedHealth = income * 0.049;
//       expect(res.healthZus).toBeCloseTo(expectedHealth, 2);
//
//       // Podatek
//       const monthlyLimit = ZUS_2026.HEALTH_ZUS.DEDUCTION_LIMIT_LINIOWY / 12;
//       const deductibleHealth = Math.min(expectedHealth, monthlyLimit);
//
//       const taxBase = Math.round(income - deductibleHealth);
//       const expectedTax = Math.round(taxBase * 0.19);
//
//       expect(res.incomeTax).toBe(expectedTax);
//     });
//   });
//
//   describe('Calculations: Skala Podatkowa (Scale)', () => {
//     beforeEach(() => {
//       service.setTaxForm('SKALA');
//       service.setZusType('ULGA');
//       service.expenses.set([]);
//     });
//
//     it('should apply 12% tax minus relief for first threshold', () => {
//       const income = 5000;
//       service.setIncome(income);
//
//       const res = service.results();
//
//       const expectedHealth = income * 0.09;
//       expect(res.healthZus).toBeCloseTo(expectedHealth, 2);
//
//       const expectedTax = Math.round((income * 0.12) - 300);
//       expect(res.incomeTax).toBe(expectedTax);
//     });
//
//     it('should apply 32% tax for income above threshold', () => {
//       const income = 15000;
//       service.setIncome(income);
//
//       const res = service.results();
//
//       const expectedTax = 900 + 1600; // (10000 * 0.12 - 300) + (5000 * 0.32)
//       expect(res.incomeTax).toBe(expectedTax);
//     });
//   });
//
//   describe('Expenses & VAT', () => {
//     it('should reduce tax base by net amount for VAT payers', () => {
//       service.setIncome(10000);
//       service.setVatRate(23);
//       service.setTaxForm('LINIOWY');
//       service.setZusType('ULGA');
//
//       service.expenses.set([{ id: 1, name: 'Test', net: 1000, vat: 23 }]);
//
//       const res = service.results();
//
//       expect(res.totalExpensesNet).toBe(1000);
//     });
//
//     it('should treat gross amount as cost for non-VAT payers', () => {
//       service.setIncome(10000);
//       service.setVatRate(0);
//       service.setTaxForm('LINIOWY');
//       service.setZusType('ULGA');
//
//       service.expenses.set([{ id: 1, name: 'Test', net: 1000, vat: 23 }]);
//
//       const res = service.results();
//       expect(res.totalExpensesNet).toBe(1230);
//     });
//
//     it('should calculate VAT to pay correctly', () => {
//       service.setIncome(10000);
//       service.setVatRate(23);
//       service.expenses.set([{ id: 1, name: 'Test', net: 1000, vat: 23 }]);
//
//       const res = service.results();
//
//       expect(res.vatAmount).toBe(2300);
//       expect(res.totalExpensesVat).toBe(230);
//       expect(res.vatToPay).toBe(2300 - 230);
//     });
//   });
//
//   describe('State Management', () => {
//     it('should add and remove expenses', () => {
//       service.expenses.set([]);
//
//       service.addExpense();
//       expect(service.expenses().length).toBe(1);
//
//       const id = service.expenses()[0].id;
//       service.updateExpense(id, 'net', 500);
//       expect(service.expenses()[0].net).toBe(500);
//
//       service.removeExpense(id);
//       expect(service.expenses().length).toBe(0);
//     });
//   });
// });
