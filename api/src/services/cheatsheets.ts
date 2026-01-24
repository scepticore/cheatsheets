import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import {and, eq} from "drizzle-orm";
import { Response, Request, NextFunction } from "express";
import { cheatsheetsTable } from "../db/schema";

console.log("Trying to open DB: ", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not defined!");
}
const client = createClient({
    url: process.env.DATABASE_URL
});

const db = drizzle(client);

export async function getCheatsheets(userId: number, res: Response) {
    try {
        const result = await db.select({
            id: cheatsheetsTable.id,
            user_id: cheatsheetsTable.user_id,
            title: cheatsheetsTable.title,
            description: cheatsheetsTable.description,
            created_at: cheatsheetsTable.created_at,
            updated_at: cheatsheetsTable.updated_at,
        }).from(cheatsheetsTable).where(eq(cheatsheetsTable.user_id, userId));
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"});
    }
}

export async function getCheatsheetById(userId: number, cheatsheetId: string, req: Request, res: Response) {
    try {
        const result = await db.select({
            id: cheatsheetsTable.id,
            user_id: cheatsheetsTable.user_id,
            title: cheatsheetsTable.title,
            description: cheatsheetsTable.description,
            created_at: cheatsheetsTable.created_at,
            updated_at: cheatsheetsTable.updated_at,
        }).from(cheatsheetsTable).where(and(eq(cheatsheetsTable.user_id, userId), eq(cheatsheetsTable.id, cheatsheetId)));
        if (result) {
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"});
    }
}

export async function createCheatsheet(req: Request, res: Response) {
    try {
        const result = await db.insert(cheatsheetsTable).values(req.body);
        res.status(201).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}

export async function updateCheatsheet(id: string, req: Request, res: Response) {
    try {
        const userId = 1;
        req.body.updated_at = new Date().toISOString();
        const result = await db.update(cheatsheetsTable).set(req.body).where(and(eq(cheatsheetsTable.id, id), eq(cheatsheetsTable.user_id, userId)));
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}

export async function deleteCheatsheet(id: string, req: Request, res: Response) {
    try {
        const result = await db.delete(cheatsheetsTable).where(eq(cheatsheetsTable.id, id));
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}