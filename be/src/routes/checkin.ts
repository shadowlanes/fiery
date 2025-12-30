import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Save or update check-in
router.post("/save", authMiddleware, async (req: AuthRequest, res) => {
    try {
        console.log(`[CheckIn API] Save request from user: ${req.userId}`);
        console.log("[CheckIn API] Payload:", JSON.stringify(req.body, null, 2));

        const { corpusValue, month } = req.body;

        // Validate required fields
        if (corpusValue === undefined || !month) {
            console.log("[CheckIn API] Validation failed: Missing required fields");
            res.status(400).json({ error: "Missing required fields: corpusValue and month" });
            return;
        }

        // Validate month format (YYYY-MM)
        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(month)) {
            console.log("[CheckIn API] Validation failed: Invalid month format");
            res.status(400).json({ error: "Invalid month format. Expected YYYY-MM" });
            return;
        }

        // Upsert check-in (create or update for user+month)
        const checkIn = await prisma.checkIn.upsert({
            where: {
                userId_month: {
                    userId: req.userId!,
                    month: month,
                },
            },
            update: {
                corpusValue,
            },
            create: {
                userId: req.userId!,
                corpusValue,
                month,
            },
        });

        console.log(`[CheckIn API] Check-in saved successfully for user: ${req.userId}, month: ${month}`);
        res.json({ success: true, checkIn });
    } catch (error) {
        console.error("[CheckIn API] Error saving check-in:", error);
        res.status(500).json({ error: "Failed to save check-in" });
    }
});

// Get latest check-in
router.get("/latest", authMiddleware, async (req: AuthRequest, res) => {
    try {
        console.log(`[CheckIn API] Get latest check-in request from user: ${req.userId}`);

        const latestCheckIn = await prisma.checkIn.findFirst({
            where: { userId: req.userId! },
            orderBy: { month: "desc" },
        });

        if (!latestCheckIn) {
            console.log(`[CheckIn API] No check-in found for user: ${req.userId}`);
            res.status(404).json({ error: "No check-in found" });
            return;
        }

        console.log(`[CheckIn API] Latest check-in found for user: ${req.userId}, month: ${latestCheckIn.month}`);
        res.json({ success: true, checkIn: latestCheckIn });
    } catch (error) {
        console.error("[CheckIn API] Error getting latest check-in:", error);
        res.status(500).json({ error: "Failed to get latest check-in" });
    }
});

// Get check-in history
router.get("/history", authMiddleware, async (req: AuthRequest, res) => {
    try {
        console.log(`[CheckIn API] Get check-in history request from user: ${req.userId}`);

        const checkIns = await prisma.checkIn.findMany({
            where: { userId: req.userId! },
            orderBy: { month: "desc" },
        });

        console.log(`[CheckIn API] Found ${checkIns.length} check-ins for user: ${req.userId}`);
        res.json({ success: true, checkIns });
    } catch (error) {
        console.error("[CheckIn API] Error getting check-in history:", error);
        res.status(500).json({ error: "Failed to get check-in history" });
    }
});

export default router;
