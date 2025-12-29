/**
 * Calculates the future value of an investment with monthly contributions.
 * Formula: A = P(1 + r/n)^(nt) + PMT * ((1 + r/n)^(nt) - 1) / (r/n)
 */
export const calculateCompoundInterest = (principal, monthlyContribution, annualRate, years) => {
    const r = annualRate;
    const n = 12;
    const t = years;

    if (r === 0) {
        return principal + (monthlyContribution * n * t);
    }

    const compoundPrincipal = principal * Math.pow(1 + r / n, n * t);
    const futureValueSeries = monthlyContribution * (Math.pow(1 + r / n, n * t) - 1) / (r / n);

    return compoundPrincipal + futureValueSeries;
};

/**
 * Generates projection data based on weighted buckets.
 * Stops when the total portfolio value reaches the target number.
 */
export const generateProjectionData = (initialCorpus, monthlyContribution, targetNumber, allocation, rates) => {
    const data = [];
    let year = 0;
    let total = initialCorpus;

    // Initial values for each bucket
    const initialEmergency = initialCorpus * (allocation.emergency / 100);
    const initialAlpha = initialCorpus * (allocation.alpha / 100);
    const initialCore = initialCorpus * (allocation.core / 100);

    // Monthly contributions for each bucket
    const monthlyEmergency = monthlyContribution * (allocation.emergency / 100);
    const monthlyAlpha = monthlyContribution * (allocation.alpha / 100);
    const monthlyCore = monthlyContribution * (allocation.core / 100);

    // Rates (convert percentage to decimal)
    const rateEmergency = rates.emergency / 100;
    const rateAlpha = rates.alpha / 100;
    const rateCore = rates.core / 100;

    // Max years to prevent infinite loop if target is unreachable
    const MAX_YEARS = 100;

    while (total < targetNumber && year <= MAX_YEARS) {
        const emergencyValue = calculateCompoundInterest(initialEmergency, monthlyEmergency, rateEmergency, year);
        const alphaValue = calculateCompoundInterest(initialAlpha, monthlyAlpha, rateAlpha, year);
        const coreValue = calculateCompoundInterest(initialCore, monthlyCore, rateCore, year);

        total = emergencyValue + alphaValue + coreValue;

        data.push({
            year,
            emergency: emergencyValue,
            alpha: alphaValue,
            core: coreValue,
            total,
            target: targetNumber,
        });

        if (total >= targetNumber) break;
        year++;
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
