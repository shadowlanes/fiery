import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import goalRoutes from "./routes/goal";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8100",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Better Auth handler
app.use("/api/auth", toNodeHandler(auth));

// Goal routes
app.use("/api/goal", goalRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
