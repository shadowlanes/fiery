export const defaultConfig = {
    targetMultiple: 25, // x annual expense
    initialCorpus: 250, // k$
    emergencyCorpus: 40, // k$
    annualIncome: 150, // k$ (example default)
    annualExpense: 60, // k$ (example default)
    allocation: {
        alpha: 32,
        core: 68,
    },
    rates: {
        emergency: 1,
        alpha: 10,
        core: 6,
    }
};

export const getInitialInputs = () => {
    if (typeof window === 'undefined') return defaultConfig;

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');

    if (q) {
        try {
            const decoded = JSON.parse(decodeURIComponent(q));
            // Merge with default config to ensure all fields exist even if url param is partial/old
            return {
                ...defaultConfig,
                ...decoded,
                allocation: { ...defaultConfig.allocation, ...decoded.allocation },
                rates: { ...defaultConfig.rates, ...decoded.rates }
            };
        } catch (e) {
            console.error("Failed to parse query param", e);
            return defaultConfig;
        }
    }

    return defaultConfig;
};

export const getShareUrl = (inputs) => {
    if (typeof window === 'undefined') return '';

    const json = JSON.stringify(inputs);
    const encoded = encodeURIComponent(json);
    const url = new URL(window.location.href);
    url.searchParams.set('q', encoded);

    return url.toString();
};
