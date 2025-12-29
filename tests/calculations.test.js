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
                allocation: { highRisk: 50, safe: 50 },
                rates: { emergency: 0, highRisk: 10, safe: 5 }
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
                allocation: { highRisk: 0, safe: 100 },
                rates: { emergency: 0, highRisk: 10, safe: 10 }
            };
            const monthlyContribution = 0;
            const targetNumber = 200;

            const data = generateProjectionData({ inputs, monthlyContribution, targetNumber });

            // Emergency bucket should stay at 50 since rate is 0
            expect(data[0].emergency).toBe(50);
            expect(data[data.length - 1].emergency).toBe(50);
        });

        it('should split contributions between High Risk and Safe', () => {
            const inputs = {
                initialCorpus: 100, // 50 emergency, 50 investable
                emergencyCorpus: 50,
                annualIncome: 100,
                annualExpense: 50,
                allocation: { highRisk: 50, safe: 50 },
                rates: { emergency: 0, highRisk: 0, safe: 0 } // 0 rates to check pure contribution
            };
            const monthlyContribution = 10; // 120k/year -> 60k highRisk, 60k safe
            const targetNumber = 500;

            // Run for 1 year
            // Initial investable: 50 -> High Risk 25, Safe 25
            // Contributions: 120 -> High Risk 60, Safe 60
            // End Year 1: High Risk 85, Safe 85

            const data = generateProjectionData({ inputs, monthlyContribution, targetNumber });
            const year1 = data.find(d => d.year === 1);

            expect(year1.highRisk).toBeCloseTo(85);
            expect(year1.safe).toBeCloseTo(85);
            expect(year1.emergency).toBe(50);
        });
    });
});
