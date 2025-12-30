import { authenticatedFetch } from "./authFetch";

export interface GoalData {
    targetMultiple: number;
    initialCorpus: number;
    emergencyCorpus: number;
    annualIncome: number;
    annualExpense: number;
    allocation: {
        highRisk: number;
        safe: number;
    };
    rates: {
        emergency: number;
        highRisk: number;
        safe: number;
    };
}

/**
 * Save user's goal to the backend
 */
export async function saveGoal(goalData: GoalData): Promise<void> {
    const response = await authenticatedFetch("/api/goal/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save goal");
    }

    return response.json();
}

/**
 * Load user's goal from the backend
 */
export async function loadGoal(): Promise<GoalData | null> {
    const response = await authenticatedFetch("/api/goal/load", {
        method: "GET",
    });

    if (response.status === 404) {
        // No goal found, return null
        return null;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to load goal");
    }

    const data = await response.json();
    return data.goal;
}

/**
 * Save user's check-in to the backend
 */
export async function saveCheckIn(corpusValue: number, month: string): Promise<any> {
    const response = await authenticatedFetch("/api/checkin/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ corpusValue, month }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save check-in");
    }

    return response.json();
}

/**
 * Get the latest check-in for the user
 */
export async function getLatestCheckIn(): Promise<any> {
    const response = await authenticatedFetch("/api/checkin/latest", {
        method: "GET",
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get latest check-in");
    }

    const data = await response.json();
    return data.checkIn;
}

/**
 * Get the check-in history for the user
 */
export async function getCheckInHistory(): Promise<any[]> {
    const response = await authenticatedFetch("/api/checkin/history", {
        method: "GET",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get check-in history");
    }

    const data = await response.json();
    return data.checkIns;
}
