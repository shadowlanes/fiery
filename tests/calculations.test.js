import { describe, it, expect } from 'vitest';
import { generateProjectionData } from '../src/utils/calculations';

describe('calculations', () => {
    describe('generateProjectionData', () => {
        it('should stop when target is reached', () => {
            const inputs = {
                initialCorpus: 100,
                emergencyCorpus: 10,
                annualIncome: 100,
                annualExpense: 50,
                allocation: { alpha: 50, core: 50 },
                rates: { emergency: 0, alpha: 10, core: 5 }
            };
            const monthlyContribution = 1; // 12k/year
            const targetNumber = 110;

            const data = generateProjectionData({ inputs, monthlyContribution, targetNumber });

            expect(data.length).toBeGreaterThan(0);
            expect(data[data.length - 1].total).toBeGreaterThanOrEqual(targetNumber);
        });

        it('should handle fixed emergency corpus correctly (no growth if rate 0, no contributions)', () => {
            const inputs = {
                initialCorpus: 100,
                emergencyCorpus: 50, // 50k fixed
                annualIncome: 100,
                annualExpense: 50,
                allocation: { alpha: 0, core: 100 },
                rates: { emergency: 0, alpha: 10, core: 10 }
            };
            const monthlyContribution = 0;
            const targetNumber = 200;

            const data = generateProjectionData({ inputs, monthlyContribution, targetNumber });

            // Emergency bucket should stay at 50 since rate is 0
            expect(data[0].emergency).toBe(50);
            expect(data[data.length - 1].emergency).toBe(50);
        });

        it('should split contributions between Alpha and Core', () => {
            const inputs = {
                initialCorpus: 100, // 50 emergency, 50 investable
                emergencyCorpus: 50,
                annualIncome: 100,
                annualExpense: 50,
                allocation: { alpha: 50, core: 50 },
                rates: { emergency: 0, alpha: 0, core: 0 } // 0 rates to check pure contribution
            };
            const monthlyContribution = 10; // 120k/year -> 60k alpha, 60k core
            const targetNumber = 500;

            // Run for 1 year
            // Initial investable: 50 -> Alpha 25, Core 25
            // Contributions: 120 -> Alpha 60, Core 60
            // End Year 1: Alpha 85, Core 85

            const data = generateProjectionData({ inputs, monthlyContribution, targetNumber });
            const year1 = data.find(d => d.year === 1);

            expect(year1.alpha).toBeCloseTo(85);
            expect(year1.core).toBeCloseTo(85);
            expect(year1.emergency).toBe(50);
        });
    });
});
