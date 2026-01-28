import "dotenv/config";
import {drizzle} from "drizzle-orm/libsql";
import {createClient} from "@libsql/client";
import {and, eq} from "drizzle-orm";
import {cheatsheetsTable} from "../db/schema.js";
import {MongoClient} from "mongodb";

console.log("Trying to open DB: ", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not defined!");
}
const client = createClient({
  url: process.env.DATABASE_URL
});

const db = drizzle(client);

export async function getCheatsheets(userId, res) {
  try {
    const result = await db.select({
      id: cheatsheetsTable.id,
      user_id: cheatsheetsTable.user_id,
      title: cheatsheetsTable.title,
      description: cheatsheetsTable.description,
      filename: cheatsheetsTable.filename,
      created_at: cheatsheetsTable.created_at,
      updated_at: cheatsheetsTable.updated_at,
    }).from(cheatsheetsTable).where(eq(cheatsheetsTable.user_id, userId));
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"});
  }
}

export async function getCheatsheetById(userId, cheatsheetId, req, res) {
  try {
    const result = await db.select({
      id: cheatsheetsTable.id,
      user_id: cheatsheetsTable.user_id,
      title: cheatsheetsTable.title,
      description: cheatsheetsTable.description,
      filename: cheatsheetsTable.filename,
      created_at: cheatsheetsTable.created_at,
      updated_at: cheatsheetsTable.updated_at,
    }).from(cheatsheetsTable).where(and(eq(cheatsheetsTable.user_id, userId), eq(cheatsheetsTable.id, cheatsheetId)));
    if (result) {
      return result[0];
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"});
  }
}

export async function getCheatsheetMarkdown(id) {
  const client = new MongoClient(process.env.MONGO_URL || "mongodb://mongodb:27017/cheatsheets");
  try {
    await client.connect();
    const doc = await client.db("cheatsheets").collection("cheatsheets").findOne({id: id});
    return doc; // Nur Daten zurückgeben
  } catch (error) {
    throw error; // Fehler nach oben "werfen"
  } finally {
    await client.close();
  }
}

export async function createCheatsheet(req, res) {
  try {
    const result = await db.insert(cheatsheetsTable).values(req.body);
    res.status(201).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}

export async function updateCheatsheet(id, req, res) {
  try {
    // @todo get real userId
    const userId = "700a71fb-9f0e-4bf4-9f86-41c66ada062e";
    req.body.updated_at = new Date().toISOString();
    const result = await db.update(cheatsheetsTable).set(req.body).where(and(eq(cheatsheetsTable.id, id), eq(cheatsheetsTable.user_id, userId)));
    res.status(200).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}

export async function updateMarkdown(id, req, res) {
  const client = new MongoClient(process.env.MONGO_URL || "mongodb://mongodb:27017/cheatsheets");
  try {
    await client.connect();
    const doc = await client.db("cheatsheets").collection("cheatsheets").updateOne({"id": id}, { $set: req.body });
    res.send(doc);
    return doc;
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}

export async function deleteCheatsheet(id, req, res) {
  try {
    const result = await db.delete(cheatsheetsTable).where(eq(cheatsheetsTable.id, id));
    res.status(200).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}