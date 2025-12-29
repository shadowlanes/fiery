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

export const getInitialInputs = (queryString) => {
    // Allow passing queryString for testing, default to window.location.search if available
    const search = queryString !== undefined ? queryString : (typeof window !== 'undefined' ? window.location.search : '');

    // Handle empty search string
    if (!search) return defaultConfig;

    const params = new URLSearchParams(search);
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

export const getShareUrl = (inputs, baseUrl) => {
    // Allow passing baseUrl for testing, default to window.location.href
    const currentUrl = baseUrl !== undefined ? baseUrl : (typeof window !== 'undefined' ? window.location.href : '');

    if (!currentUrl) return '';

    const json = JSON.stringify(inputs);
    const encoded = encodeURIComponent(json);

    try {
        const url = new URL(currentUrl);
        url.searchParams.set('q', encoded);
        return url.toString();
    } catch (e) {
        console.error("Invalid base URL", e);
        return '';
    }
};
