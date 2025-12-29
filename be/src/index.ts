import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8100",
    credentials: true
}));

app.use(express.json());

// Better Auth handler
app.use("/api/auth", toNodeHandler(auth));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
