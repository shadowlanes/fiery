import { authClient } from "./auth-client";

// Vite provides import.meta.env
const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

/**
 * Wrapper for authenticated API calls
 * Automatically includes the Better Auth session token
 */
export async function authenticatedFetch(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    const session = await authClient.getSession();
    
    if (!session) {
        throw new Error("Not authenticated");
    }

    const headers = new Headers(options.headers);
    
    // Better Auth stores the session token in a cookie
    // The cookie will be automatically sent with credentials: 'include'
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
    });

    return response;
}
