import "dotenv/config";

export const API_BASE = process.env.VITE_API_URL || "http://localhost:3030/api";
export const HOST = process.env.HOST || "http://localhost:5173";