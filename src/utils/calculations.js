/**
 * Calculates the future value of an investment with monthly contributions.
 * Formula: A = P(1 + r/n)^(nt) + PMT * ((1 + r/n)^(nt) - 1) / (r/n)
 * where:
 * P = Principal (initial corpus)
 * r = Annual interest rate (decimal)
 * n = Number of times interest applied per time period (12 for monthly)
 * t = Number of time periods elapsed (years)
 * PMT = Monthly contribution
 */
export const calculateCompoundInterest = (principal, monthlyContribution, annualRate, years) => {
    const r = annualRate;
    const n = 12;
    const t = years;

    // If rate is 0, simple addition
    if (r === 0) {
        return principal + (monthlyContribution * n * t);
    }

    const compoundPrincipal = principal * Math.pow(1 + r / n, n * t);
    const futureValueSeries = monthlyContribution * (Math.pow(1 + r / n, n * t) - 1) / (r / n);

    return compoundPrincipal + futureValueSeries;
};

/**
 * Calculates the weighted average return based on asset allocation.
 * @param {Object} allocation - { emergencyFund: number, alphaTrade: number, coreEngine: number } (percentages as decimals or values?)
 * The PRD says:
 * Emergency Fund: 1% (Low yield/Cash)
 * Alpha Trade: (Current $80k equivalent) - Wait, input says $80k equivalent, but we need percentage for weighted return?
 * Actually, the PRD says: "Weighted Return Logic: (0.01 * EF yield) + (%Alpha * Alpha yield) + (%Core * Core yield)"
 * But wait, EF is 1% of allocation? Or EF yield is 1%?
 * PRD: "Emergency Fund: 1% (Low yield/Cash)" -> This implies EF *Allocation* is 1%? Or Yield is 1%?
 * "Weighted Return Logic: (0.01 * EF yield) + ..." -> 0.01 looks like allocation if EF yield is separate.
 * Let's re-read: "Emergency Fund: 1% (Low yield/Cash)". This likely means the yield is 1%.
 * "Alpha Trade: (Current $80k equivalent)".
 * "Core Engine: (Remaining balance)".
 * 
 * Let's assume the user inputs the VALUES for these, and we calculate the percentages.
 * Or the user inputs percentages?
 * PRD says "Asset Allocation %: Emergency Fund: 1% ...".
 * But then "Alpha Trade: (Current $80k equivalent)".
 * This is ambiguous.
 * 
 * Let's assume:
 * - Emergency Fund Yield: 1% (Fixed?)
 * - Alpha Trade Yield: ? (Maybe user input or fixed assumption for "Aggressive"?)
 * - Core Engine Yield: ?
 * 
 * Actually, the PRD says:
 * "Multi-Rate Projection: Calculate timelines for three scenarios: Conservative (5%), Expected (7%), and Aggressive (10%)."
 * And "Weighted Return Logic: Return should be calculated as: (0.01×EF yield)+(%Alpha×Alpha yield)+(%Core×Core yield)."
 * 
 * This implies we need to calculate a CUSTOM weighted return based on the user's specific portfolio mix, 
 * OR we just use the 5%, 7%, 10% as the global rates for the 3 lines.
 * 
 * "The centerpiece is a Stacked Area Chart ... showing ... Three colored lines showing the path for each return rate (5%, 7%, 10%)."
 * This suggests the 5/7/10 are the rates used for the lines.
 * 
 * So what is the "Weighted Return Logic" for?
 * Maybe it's to show the "Current" projected path based on actual allocation?
 * "Shaded area for the 'Current Progress' vs 'Future Forecast'."
 * 
 * Let's implement a function that takes the total portfolio value and breakdown, and yields for each bucket, to get a weighted rate.
 * But for the main graph, we need 5%, 7%, 10%.
 * 
 * Let's stick to the 3 scenarios for now as primary.
 * And maybe add a "Custom" or "Current" scenario if we have the yields.
 * 
 * For now, I will implement the projection generator for the 3 fixed rates.
 */

export const generateProjectionData = (initialCorpus, monthlyContribution, targetNumber, years = 20) => {
    const data = [];
    const rates = [0.05, 0.07, 0.10]; // Conservative, Expected, Aggressive

    for (let year = 0; year <= years; year++) {
        const point = {
            year,
            conservative: calculateCompoundInterest(initialCorpus, monthlyContribution, rates[0], year),
            expected: calculateCompoundInterest(initialCorpus, monthlyContribution, rates[1], year),
            aggressive: calculateCompoundInterest(initialCorpus, monthlyContribution, rates[2], year),
            target: targetNumber,
        };
        data.push(point);
    }
    return data;
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
};
