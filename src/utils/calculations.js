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
 * Calculates the number of years to reach a target amount.
 * Solves for t in the compound interest formula.
 * Formula derived from A = P(1+r/n)^(nt) + PMT * ((1+r/n)^(nt) - 1) / (r/n)
 * Let R = 1 + r/n
 * A = P * R^(nt) + PMT * (R^(nt) - 1) / (r/n)
 * A * (r/n) = P * (r/n) * R^(nt) + PMT * R^(nt) - PMT
 * A * (r/n) + PMT = R^(nt) * (P * (r/n) + PMT)
 * R^(nt) = (A * (r/n) + PMT) / (P * (r/n) + PMT)
 * nt = ln((A * (r/n) + PMT) / (P * (r/n) + PMT)) / ln(R)
 * t = ln(...) / (n * ln(R))
 */
export const calculateYearsToTarget = (principal, monthlyContribution, annualRate, target) => {
    if (principal >= target) return 0;

    const r = annualRate;
    const n = 12;

    // If rate is 0, simple linear equation: target = principal + (monthly * 12 * t)
    if (r === 0) {
        if (monthlyContribution <= 0) return Infinity; // Never reach if no growth and no contribution
        return (target - principal) / (monthlyContribution * 12);
    }

    const numerator = Math.log((target * (r / n) + monthlyContribution) / (principal * (r / n) + monthlyContribution));
    const denominator = n * Math.log(1 + r / n);

    const years = numerator / denominator;
    return Math.max(0, years);
};

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
    }).format(value) + 'k';
};
