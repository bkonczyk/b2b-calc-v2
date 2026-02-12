import { TestBed } from '@angular/core/testing';
import { VatCalculationService } from './vat-calculation.service';

describe('VatCalculationService (z zaokrąglaniem)', () => {
    let service: VatCalculationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VatCalculationService);
    });

    describe('Logika zaokrągleń (Accounting Rules)', () => {

        it('powinien zaokrąglać VAT w górę od końcówki .005 (half-up)', () => {
            // Given: 100.50 netto * 1% VAT = 1.005
            // Oczekujemy zaokrąglenia do 1.01 (zgodnie z matematyką finansową)
            // Bez Number.EPSILON JS często zaokrągliłby to do 1.00

            const result = service.calculate(100.50, 1, 0);

            expect(result.vatAmount).toBe(1.01);
            expect(result.grossTotal).toBe(101.51);
        });

        it('powinien zaokrąglać w dół dla końcówki poniżej .005', () => {
            // Given: 100.40 * 1% = 1.004 -> powinno być 1.00
            const result = service.calculate(100.40, 1, 0);

            expect(result.vatAmount).toBe(1.00);
        });

        it('powinien poprawnie obsłużyć "trudny" przypadek mnożenia floatów', () => {
            // Given: Przychód 19.99, VAT 23%
            // 19.99 * 0.23 = 4.5977
            // Zaokrąglenie do 2 miejsc -> 4.60

            const result = service.calculate(19.99, 23, 0);

            expect(result.vatAmount).toBe(4.60);
            expect(result.grossTotal).toBe(24.59); // 19.99 + 4.60
        });
    });

    describe('Integracja obliczeń podatkowych', () => {
        it('powinien poprawnie wyliczyć VAT do zapłaty przy groszowych różnicach', () => {
            // Given:
            // VAT należny wyliczony: 230.555 -> 230.56
            // Odliczenie: 100.00

            const result = service.calculate(1002.413, 23, 100);
            // 1002.413 * 0.23 = 230.55499 -> zaokr. do 230.55 (tutaj końcówka jest < 5)

            expect(result.vatAmount).toBe(230.55);
            expect(result.vatToPay).toBe(131.00);
        });

        it('nie powinien zwrócić ujemnego wyniku (tarcza podatkowa) przy zaokrągleniach', () => {
            // Given: VAT należny 50.00, odliczenie 50.01
            const result = service.calculate(217.3913, 23, 50.01);
            // 217.3913 * 0.23 ~= 50.000... -> 50.00

            expect(result.vatAmount).toBe(50.00);
            expect(result.vatToPay).toBe(0); // Math.max(0, -0.01)
        });
    });
});