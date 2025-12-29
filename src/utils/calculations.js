/**
 * Calculates the future value of an investment with monthly contributions.
 * Formula: A = P(1 + r/n)^(nt) + PMT * ((1 + r/n)^(nt) - 1) / (r/n)
 */
/**
 * Calculates the future value of an investment with monthly contributions.
 * Formula: A = P(1 + r/n)^(nt) + PMT * ((1 + r/n)^(nt) - 1) / (r/n)
 */
const calculateCompoundInterest = (principal, monthlyContribution, annualRate, years) => {
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
 * 
 * param {Object} config - The configuration object
 * param {Object} config.inputs - User inputs { initialCorpus, emergencyCorpus, allocation, rates }
 * param {number} config.monthlyContribution - Monthly contribution amount
 * param {number} config.targetNumber - Target FIRE number
 */
export const generateProjectionData = ({ inputs, monthlyContribution, targetNumber }) => {
    const { initialCorpus, emergencyCorpus, allocation, rates } = inputs;
    const data = [];
    let year = 0;

    // Initial values for each bucket
    // Emergency fund is fixed at start
    const initialEmergency = emergencyCorpus;

    // Investable corpus is the remainder
    const investableCorpus = Math.max(0, initialCorpus - emergencyCorpus);

    const initialHighRisk = investableCorpus * (allocation.highRisk / 100);
    const initialSafe = investableCorpus * (allocation.safe / 100);

    // Monthly contributions for each bucket (0 for emergency)
    const monthlyEmergency = 0;
    const monthlyHighRisk = monthlyContribution * (allocation.highRisk / 100);
    const monthlySafe = monthlyContribution * (allocation.safe / 100);

    // Rates (convert percentage to decimal)
    const rateEmergency = rates.emergency / 100;
    const rateHighRisk = rates.highRisk / 100;
    const rateSafe = rates.safe / 100;

    // Max years to prevent infinite loop if target is unreachable
    const MAX_YEARS = 100;

    let total = initialEmergency + initialHighRisk + initialSafe;

    while (total < targetNumber && year <= MAX_YEARS) {
        const emergencyValue = calculateCompoundInterest(initialEmergency, monthlyEmergency, rateEmergency, year);
        const highRiskValue = calculateCompoundInterest(initialHighRisk, monthlyHighRisk, rateHighRisk, year);
        const safeValue = calculateCompoundInterest(initialSafe, monthlySafe, rateSafe, year);

        total = emergencyValue + highRiskValue + safeValue;

        data.push({
            year,
            emergency: emergencyValue,
            highRisk: highRiskValue,
            safe: safeValue,
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
