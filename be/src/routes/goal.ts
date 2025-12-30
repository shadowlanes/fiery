import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Save or update goal
router.post("/save", authMiddleware, async (req: AuthRequest, res) => {
    try {
        console.log(`[Goal API] Save request from user: ${req.userId}`);
        console.log("[Goal API] Payload:", JSON.stringify(req.body, null, 2));

        const {
            targetMultiple,
            initialCorpus,
            emergencyCorpus,
            annualIncome,
            annualExpense,
            allocation,
            rates,
        } = req.body;

        // Validate required fields
        if (
            targetMultiple === undefined ||
            initialCorpus === undefined ||
            emergencyCorpus === undefined ||
            annualIncome === undefined ||
            annualExpense === undefined ||
            !allocation ||
            !rates
        ) {
            console.log("[Goal API] Validation failed: Missing required fields");
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        // Upsert goal (create or update)
        const goal = await prisma.goal.upsert({
            where: { userId: req.userId! },
            update: {
                targetMultiple,
                initialCorpus,
                emergencyCorpus,
                annualIncome,
                annualExpense,
                allocationHighRisk: allocation.highRisk,
                allocationSafe: allocation.safe,
                rateEmergency: rates.emergency,
                rateHighRisk: rates.highRisk,
                rateSafe: rates.safe,
            },
            create: {
                userId: req.userId!,
                targetMultiple,
                initialCorpus,
                emergencyCorpus,
                annualIncome,
                annualExpense,
                allocationHighRisk: allocation.highRisk,
                allocationSafe: allocation.safe,
                rateEmergency: rates.emergency,
                rateHighRisk: rates.highRisk,
                rateSafe: rates.safe,
            },
        });

        console.log(`[Goal API] Goal saved successfully for user: ${req.userId}`);
        res.json({ success: true, goal });
    } catch (error) {
        console.error("[Goal API] Error saving goal:", error);
        res.status(500).json({ error: "Failed to save goal" });
    }
});

// Load goal
router.get("/load", authMiddleware, async (req: AuthRequest, res) => {
    try {
        console.log(`[Goal API] Load request from user: ${req.userId}`);

        const goal = await prisma.goal.findUnique({
            where: { userId: req.userId! },
        });

        if (!goal) {
            console.log(`[Goal API] No goal found for user: ${req.userId}`);
            res.status(404).json({ error: "No goal found" });
            return;
        }

        console.log(`[Goal API] Goal loaded successfully for user: ${req.userId}`);
        
        // Transform database format to frontend format
        const goalData = {
            targetMultiple: goal.targetMultiple,
            initialCorpus: goal.initialCorpus,
            emergencyCorpus: goal.emergencyCorpus,
            annualIncome: goal.annualIncome,
            annualExpense: goal.annualExpense,
            allocation: {
                highRisk: goal.allocationHighRisk,
                safe: goal.allocationSafe,
            },
            rates: {
                emergency: goal.rateEmergency,
                highRisk: goal.rateHighRisk,
                safe: goal.rateSafe,
            },
        };

        res.json({ success: true, goal: goalData });
    } catch (error) {
        console.error("[Goal API] Error loading goal:", error);
        res.status(500).json({ error: "Failed to load goal" });
    }
});

export default router;
