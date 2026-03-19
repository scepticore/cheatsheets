import "dotenv/config";
import express from "express";
import cors from 'cors';

import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import cheatsheetRoutes from "./routes/cheatsheetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 3030;
const ORIGIN = process.env.VITE_HOST;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
    origin: ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['content-type', 'Authorization']
}));

const absoluteOutputPath = path.join(__dirname, "..", "output");

console.log("Static files served from:", absoluteOutputPath);

app.use("/output", express.static(absoluteOutputPath, {
    setHeaders: (res) => {
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data: blob:;");
    }
}));

app.use(express.json());
app.use("/api", [userRoutes, cheatsheetRoutes, pdfRoutes]);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// @todo split and make app.use("/users") as well as app.use("/cheatsheets") etc.
// app.use("/api/users", userRoutes);
// app.use("/api/cheatsheets", cheatsheetRoutes);
// app.use("/api/pdf", pdfRoutes);


/**
 * Main entry point for API
 */
app.get("/", (req, res) => {
    res.json("Cheatsheet API v 1.0.0");
});

/**
 * Start server
 */
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Cheatsheets API runs on http://0.0.0.0:${PORT}`);
});
