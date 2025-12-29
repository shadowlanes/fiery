import { describe, it, expect } from 'vitest';
import { getInitialInputs, getShareUrl, defaultConfig } from '../src/utils/inputFetcher';

describe('inputFetcher', () => {
    describe('getInitialInputs', () => {
        /**
         * We can now test pure logic by passing query strings directly.
         * No need to mock window or environment.
         */

        it('should return default config if no query string passed', () => {
            const result = getInitialInputs('');
            expect(result).toEqual(defaultConfig);
        });

        it('should parse and merge valid query param', () => {
            const customInputs = {
                targetMultiple: 30,
                initialCorpus: 300,
                emergencyCorpus: 50,
                rates: { emergency: 2, highRisk: 12, safe: 7 }
            };
            const encoded = encodeURIComponent(JSON.stringify(customInputs));
            const queryString = `?q=${encoded}`;

            const result = getInitialInputs(queryString);

            expect(result.targetMultiple).toBe(30);
            expect(result.initialCorpus).toBe(300);
            expect(result.rates.emergency).toBe(2);
            // Should preserve defaults for missing fields
            expect(result.annualIncome).toBe(defaultConfig.annualIncome);
        });

        it('should return default config on invalid JSON in query param', () => {
            const encoded = encodeURIComponent("invalid-json");
            const queryString = `?q=${encoded}`;

            const result = getInitialInputs(queryString);
            expect(result).toEqual(defaultConfig);
        });
    });

    describe('getShareUrl', () => {
        it('should generate correct share URL', () => {
            const inputs = { ...defaultConfig, targetMultiple: 50 };
            const baseUrl = 'http://localhost:5173/';

            const url = getShareUrl(inputs, baseUrl);
            const urlObj = new URL(url);
            const q = urlObj.searchParams.get('q');
            const decoded = JSON.parse(decodeURIComponent(q));

            expect(decoded.targetMultiple).toBe(50);
        });
    });
});
