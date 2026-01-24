import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as path from "path";

// Lädt die .env aus dem Hauptverzeichnis (zwei Ebenen höher als src/db/...)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        // Nutzt DATABASE_URL aus der .env
        url: process.env.DATABASE_URL || "file:./db/cheatsheet.db",
    },
});