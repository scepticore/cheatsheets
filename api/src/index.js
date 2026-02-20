import 'dotenv/config';
import express from "express";
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import cheatsheetRoutes from "./routes/cheatsheetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();
const PORT = process.env.PORT || 3030;
// const mongoUri = process.env.MONGO_URL;

/* @todo put port in .env */
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['content-type', 'Authorization']
}));

app.use(express.json());
app.use("/api", [userRoutes, cheatsheetRoutes, pdfRoutes]);
app.use("/api/auth", authRoutes);
app.use("/output", express.static("output"));

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
