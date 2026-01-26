import 'dotenv/config';
import express from "express";
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import cheatsheetRoutes from "./routes/cheatsheetRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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
app.use("/api", [userRoutes, cheatsheetRoutes, authRoutes]);

app.get("/", (req, res) => {
    res.json("Cheatsheet API v 0.0.1");
});

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`API läuft auf http://0.0.0.0:${PORT}`);
});
