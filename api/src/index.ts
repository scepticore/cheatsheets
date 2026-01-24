import express, { Request, Response } from "express";
import cors from 'cors';
import userRoutes from "./routes/userRoutes";
import cheatsheetRoutes from "./routes/cheatsheetRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3030;

/* @todo put port in .env */
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['content-type', 'Authorization']
}));

app.use(express.json());
app.use("/api", [userRoutes, cheatsheetRoutes, authRoutes]);

app.get("/", (req: Request, res: Response) => {
    res.json("Cheatsheet API v 0.0.1");
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});