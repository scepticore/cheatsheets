import "dotenv/config";
import {drizzle} from "drizzle-orm/libsql";
import {createClient} from "@libsql/client";
import {and, eq} from "drizzle-orm";
import {cheatsheetsTable} from "../db/schema.js";
import {MongoClient} from "mongodb";
import {randomUUID} from "node:crypto";
import {getMongoClient} from "../utils/mongo.js";

console.log("Trying to open DB: ", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not defined!");
}
const client = createClient({
  url: process.env.DATABASE_URL
});

const db = drizzle(client);

/**
 * Get cheatsheet list
 * @param userId
 * @param res
 * @returns {Promise<void>}
 */
export async function getCheatsheets(userId, res) {
  try {
    const result = await db.select({
      id: cheatsheetsTable.id,
      user_id: cheatsheetsTable.user_id,
      title: cheatsheetsTable.title,
      description: cheatsheetsTable.description,
      filename: cheatsheetsTable.filename,
      public: cheatsheetsTable.public,
      created_at: cheatsheetsTable.created_at,
      updated_at: cheatsheetsTable.updated_at,
    }).from(cheatsheetsTable).where(eq(cheatsheetsTable.user_id, userId));
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured", body: error});
  }
}

/**
 * Get cheatsheet by ID
 * @param userId
 * @param cheatsheetId
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function getCheatsheetById(userId, cheatsheetId, req, res) {
  try {
    const result = await db.select({
      id: cheatsheetsTable.id,
      user_id: cheatsheetsTable.user_id,
      title: cheatsheetsTable.title,
      description: cheatsheetsTable.description,
      filename: cheatsheetsTable.filename,
      public: cheatsheetsTable.public,
      columns: cheatsheetsTable.columns,
      font_size: cheatsheetsTable.font_size,
      created_at: cheatsheetsTable.created_at,
      updated_at: cheatsheetsTable.updated_at,
    }).from(cheatsheetsTable).where(and(eq(cheatsheetsTable.user_id, userId), eq(cheatsheetsTable.id, cheatsheetId)));
    if (result) {
      return result[0];
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured", body: error});
  }
}

/**
 * Get Markdown for cheatsheet
 * @param id
 * @returns {Promise<Document & {_id: InferIdType<Document>}>}
 */
export async function getCheatsheetMarkdown(id) {
  // const client = new MongoClient(process.env.MONGO_URL || "mongodb://mongodb:27017/cheatsheets");
  try {
    const mongodb = await getMongoClient();
    const doc = await mongodb.collection("cheatsheets").findOne({id: id});
    return doc; // Nur Daten zurückgeben
  } catch (error) {
    throw error; // Fehler nach oben "werfen"
  } finally {
  }
}

/**
 * Create new cheatsheet in SQLite
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function createCheatsheet(req, res) {

  try {
    const userId = "700a71fb-9f0e-4bf4-9f86-41c66ada062e"
    const UUID = randomUUID();
    const body = {
      id: UUID,
      user_id: userId,
      title: `Draft ${UUID}`,
      columns: 5,
      font_size: 10,
      status: 1,
      public: 0
    }
    const result = await db.insert(cheatsheetsTable).values(body).returning({uuid: cheatsheetsTable.id});
    const markdown = await createCheatsheetMarkdown(UUID, body, req, res);
    console.log(markdown);
    res.status(201).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}

/**
 * Create new cheatsheet in MongoDB
 * @param id
 * @param body
 * @param req
 * @param res
 * @returns {Promise<*|boolean>}
 */
export async function createCheatsheetMarkdown(id, body, req, res) {
  // const client = new MongoClient(process.env.MONGO_URL || "mongodb://mongodb:27017/cheatsheets");
  try {
    // const newUuid = result[0].uuid;
    const mongodb = await getMongoClient();
    await mongodb.collection("cheatsheets").insertOne({id: id, body: "", createdAt: new Date()});
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
  }
}

/**
 * Update cheatsheet meta in SQLite
 * @param id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function updateCheatsheet(id, req, res) {
  try {
    // @todo get real userId
    const userId = "700a71fb-9f0e-4bf4-9f86-41c66ada062e";
    console.log(req.body);
    req.body.updated_at = new Date().toISOString();
    const result = await db.update(cheatsheetsTable).set(req.body).where(and(eq(cheatsheetsTable.id, id), eq(cheatsheetsTable.user_id, userId)));
    res.status(200).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}

/**
 * Update markdown in MongoDB
 * @param id
 * @param req
 * @param res
 * @returns {Promise<UpdateResult<Document>>}
 */
export async function updateMarkdown(id, req, res) {
  // const client = new MongoClient(process.env.MONGO_URL || "mongodb://mongodb:27017/cheatsheets");
  try {
    // await client.connect();
    // const doc = await client.db("cheatsheets").collection("cheatsheets").updateOne({"id": id}, { $set: req.body });
    const mongodb = await getMongoClient();
    const doc = await mongodb.collection("cheatsheets").updateOne({"id": id}, { $set: req.body });
    res.send(doc);
    return doc;
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}

/**
 * Move cheatsheet to trash
 * @param id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function trashCheatsheet(id, req, res) {
  try {

  } catch (e) {
    console.error(e);
  } finally {

  }
}

/**
 * Delete cheatsheet in SQLite
 * @param id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function deleteCheatsheet(id, req, res) {
  try {
    // @todo set status to inactive (0)
    const result = await db.delete(cheatsheetsTable).where(eq(cheatsheetsTable.id, id));
    res.status(200).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}

/**
 * Delete Cheatsheet markdown from MongoDB
 * @param id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function deleteCheatsheetMarkdown(id, req, res) {
  try {

  } catch (e) {
    console.error(e);
  } finally {

  }
}