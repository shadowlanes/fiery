import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log("[Auth Middleware] Checking authentication...");
        
        // Verify session using Better Auth
        // This automatically handles cookie extraction (including __Secure- prefix) and header parsing
        const session = await auth.api.getSession({
            headers: req.headers as any,
        });

        if (!session || !session.user) {
            console.log("[Auth Middleware] Invalid or expired session");
            res.status(401).json({ error: "Invalid or expired session" });
            return;
        }

        console.log(`[Auth Middleware] Session verified for user: ${session.user.id}`);
        
        // Attach user ID to request
        req.userId = session.user.id;
        next();
    } catch (error) {
        console.error("[Auth Middleware] Error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
};
