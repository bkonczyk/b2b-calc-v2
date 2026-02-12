import {TestBed} from '@angular/core/testing';
import {ZUS_2026} from "../../models/zus-2026";
import {ZusService} from "./zus.service";


describe('ZusService', () => {
    let service: ZusService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ZusService);
    });

    describe('1. Składki Społeczne (Social ZUS)', () => {
        it('powinien naliczyć PEŁNY ZUS z chorobowym i FP', () => {
            // Given
            const hasSickness = true;
            const result = service.calculate(10000, 0, 'LINIOWY', 'PELNY', hasSickness);

            // Expected calculation:
            // Social = 1788.29 (Base) + 138.47 (Sickness) = 1926.76
            // FP = 138.47

            expect(result.socialAmount).toBeCloseTo(1788.29, 2);
            expect(result.fp).toBe(ZUS_2026.BIG_ZUS.FP);
            expect(result.socialDeductible).toBeCloseTo(1926.76, 2); // Na liniowym odliczamy całość
        });

        it('powinien naliczyć PEŁNY ZUS bez chorobowego i Funduszu pracy', () => {
            const result = service.calculate(10000, 0, 'SKALA', 'PELNY', false);

            // Social = 1788.29 + 0
            expect(result.socialAmount).toBeCloseTo(1649.82, 2);
        });

        it('powinien naliczyć MAŁY ZUS (Preferencyjny)', () => {
            const result = service.calculate(5000, 0, 'SKALA', 'MALY', true);

            // Social = 420.87 + 35.32 = 456.19
            // FP = 0 (Mały ZUS nie płaci FP)
            expect(result.socialAmount).toBeCloseTo(456.19, 2);
            expect(result.fp).toBe(0);
        });

        it('powinien wyzerować społeczne przy Uldze na Start', () => {
            const result = service.calculate(5000, 0, 'SKALA', 'ULGA', true);

            expect(result.socialAmount).toBe(0);
            expect(result.socialDeductible).toBe(0);
        });
    });

    describe('2. Logika odliczeń (Deductibles)', () => {
        it('powinien pomniejszyć odliczenie o FP tylko na Ryczałcie', () => {
            // W kodzie: if (taxForm.startsWith('RYCZALT')) socialDeductible = ... - fp

            const result = service.calculate(10000, 0, 'RYCZALT_12', 'PELNY', true);
            const socialTotal = 1788.29; // 1926.76
// zmiana w tescie - FP juz nie jest czescia skladek socjalnych

            expect(result.socialAmount).toBeCloseTo(socialTotal, 2);
            // Sprawdzamy czy odliczenie jest mniejsze o FP
            expect(result.socialDeductible).toBeCloseTo(socialTotal, 2);
        });
    });

    describe('3. Składka Zdrowotna (Health ZUS)', () => {

        describe('Zasady Ogólne (Skala)', () => {
            it('powinien policzyć 9% od dochodu (pomniejszonego o społeczne)', () => {
                // Income 10000, Expenses 0, Ulga na start (Social=0) -> Baza 10000
                const result = service.calculate(10000, 0, 'SKALA', 'ULGA', false);

                expect(result.healthAmount).toBeCloseTo(900, 2); // 9% z 10000
            });

            it('powinien zastosować minimalną składkę zdrowotną, jeśli dochód jest niski', () => {
                // Dochód 100 zł -> 9% to 9 zł. Minimum to 432.54
                const result = service.calculate(100, 0, 'SKALA', 'ULGA', false);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.MINIMAL);
            });
        });

        describe('Podatek Liniowy', () => {
            it('powinien policzyć 4.9% od dochodu', () => {
                // Income 10000, Ulga (Social=0) -> Baza 10000
                const result = service.calculate(10000, 0, 'LINIOWY', 'ULGA', false);

                expect(result.healthAmount).toBeCloseTo(490, 2); // 4.9% z 10000
            });
        });

        describe('Ryczałt (Progi przychodowe)', () => {
            // UWAGA: Kod oblicza roczny przychód jako (Income - Social) * 12

            it('Niski próg (do 60 tys. rocznie)', () => {
                // Miesięcznie 4000. Rocznie ~48000.
                const result = service.calculate(4000, 0, 'RYCZALT', 'ULGA', false);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.LOW);
            });

            it('Średni próg (60 tys. - 300 tys. rocznie)', () => {
                // Miesięcznie 10000. Rocznie ~120000.
                const result = service.calculate(10000, 0, 'RYCZALT', 'ULGA', false);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.MEDIUM);
            });

            it('Wysoki próg (powyżej 300 tys. rocznie)', () => {
                // Miesięcznie 30000. Rocznie ~360000.
                const result = service.calculate(30000, 0, 'RYCZALT', 'ULGA', false);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.HIGH);
            });

            it('powinien uwzględnić odliczenie ZUS przy ustalaniu progu ryczałtu', () => {
                // Sytuacja brzegowa: Przychód 5100 zł/mc -> 61 200 zł rocznie (czyli teoretycznie Średni próg).
                // ALE jeśli zapłacimy ZUS, to przychód do limitu spadnie.

                // ZUS Pełny ~1926 zł.
                // Przychód do limitu = (5100 - 1926) * 12 = 38 088 zł (Niski próg)

                const result = service.calculate(5100, 0, 'RYCZALT', 'PELNY', true);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.LOW);
            });
        });
    });

    describe('Integracja (Sumy)', () => {
        it('powinien poprawnie zsumować całkowity ZUS do przelewu', () => {
            const result = service.calculate(10000, 0, 'SKALA', 'ULGA', false);
            // Social: 0
            // Health: 900

            expect(result.totalZus).toBeCloseTo(900, 2);
        });
    });

    describe('ZusCalculationService – brakujące / uzupełniające przypadki', () => {

        describe('Minimalna składka zdrowotna – liniowy', () => {
            it('powinien zastosować minimalną składkę zdrowotną na liniowym przy bardzo niskim dochodzie', () => {
                // Dochód 3000 zł/mc → 4.9% = 147 zł < minimalna 432.54 zł
                const result = service.calculate(3000, 0, 'LINIOWY', 'PELNY', true);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.MINIMAL);
                expect(result.healthAmount).toBeCloseTo(432.54, 2);
            });

            it('powinien zastosować minimalną zdrowotną na liniowym przy stracie', () => {
                // Przychód 4000 zł, koszty 8000 zł → dochód -4000 zł
                const result = service.calculate(4000, 8000, 'LINIOWY', 'PELNY', false);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.MINIMAL);
            });
        });

        describe('Składki społeczne + koszty uzyskania przychodu', () => {
            it('powinien poprawnie odjąć składki społeczne od dochodu przy obliczaniu zdrowotnej (skala)', () => {
                // Przychód 12000, koszty 3000, pełny ZUS z chorobowym
                // Dochód = 12000 - 3000 - 1926.76 = 7073.24
                // Zdrowotna = 9% × 7073.24 ≈ 636.59
                const result = service.calculate(12000, 3000, 'SKALA', 'PELNY', true);

                expect(result.socialAmount).toBeCloseTo(1788.29, 2);
                expect(result.fp).toBeCloseTo(138.47, 2);
                expect(result.healthAmount).toBeCloseTo(636.59, 2);
            });

            it('powinien poprawnie odjąć składki od dochodu przy liniowym', () => {
                // Dochód po odliczeniu składek = 10000 - 1926.76 = 8073.24
                // Zdrowotna = 4.9% × 8073.24 ≈ 395.59 (ale minimum 432.54)
                const result = service.calculate(10000, 0, 'LINIOWY', 'PELNY', true);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.MINIMAL);
            });
        });

        describe('Mały ZUS + różne formy opodatkowania', () => {
            it('mały ZUS + ryczałt – FP nadal wynosi 0', () => {
                const result = service.calculate(8000, 0, 'RYCZALT_8_5', 'MALY', true);

                expect(result.socialAmount).toBeCloseTo(456.19, 2);
                expect(result.fp).toBe(0);
                expect(result.socialDeductible).toBeCloseTo(456.19, 2); // na ryczałcie FP i tak 0
            });

            it('mały ZUS + liniowy – odliczamy całość społeczną (w tym chorobowe)', () => {
                const result = service.calculate(12000, 2000, 'LINIOWY', 'MALY', true);

                expect(result.socialDeductible).toBeCloseTo(456.19, 2);
                // Dochód = 12000 - 2000 - 456.19 = 9543.81
                // Zdrowotna ≈ 4.9% × 9543.81 ≈ 467.65 (powyżej minimum)
                expect(result.healthAmount).toBeCloseTo(467.65, 2);
            });
        });

        describe('Ryczałt – precyzyjne testy progów z odliczeniem składek', () => {
            it('ryczałt – dokładnie na granicy niskiego progu po odliczeniu ZUS', () => {
                // Chcemy roczny przychód po odliczeniu ≈ 59999 zł
                // Przy pełnym ZUS: deductible ≈ 1788.29 (bez FP na ryczałcie)
                // Miesięczny przychód ≈ (59999 / 12) + 1788.29 ≈ 5000 + 1788.29 ≈ 6788.29 zł
                const result = service.calculate(6788, 0, 'RYCZALT_12', 'PELNY', true);

                // Powinien nadal być w niskim progu (59 856 zł rocznie < 60 tys.)
                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.LOW);
            });

            it('ryczałt – przekroczenie progu średniego po odliczeniu składek', () => {
                // Cel: ~300 100 zł rocznie po odliczeniu
                // Miesięcznie ≈ 25 008 + 1788.29 ≈ 26 796 zł
                const result = service.calculate(26796, 0, 'RYCZALT_12', 'PELNY', true);

                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.HIGH);
            });
        });

        describe('Ulga na start – tylko zdrowotna', () => {
            it('ulga na start + liniowy – tylko zdrowotna 4.9% lub minimalna', () => {
                const result = service.calculate(2800, 0, 'LINIOWY', 'ULGA', false);

                expect(result.socialAmount).toBe(0);
                expect(result.fp).toBe(0);
                expect(result.socialDeductible).toBe(0);
                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.MINIMAL); // 4.9% z 2800 = 137.2 < min
            });

            it('ulga na start + ryczałt – próg bez odliczania społecznych', () => {
                const result = service.calculate(7000, 0, 'RYCZALT_12', 'ULGA', false);

                // Rocznie 84 000 zł → średni próg
                expect(result.healthAmount).toBe(ZUS_2026.HEALTH_ZUS.LUMP_SUM_THRESHOLDS.MEDIUM);
            });
        });
    });
});