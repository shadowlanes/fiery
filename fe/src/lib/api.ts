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
