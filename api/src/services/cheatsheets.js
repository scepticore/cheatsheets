import {db} from '../utils/db.js';
import "dotenv/config";
import {getMongoClient} from "../utils/mongo.js";
import {and, eq} from "drizzle-orm";
import {cheatsheetsTable} from "../db/schema.js";
import {randomUUID} from "node:crypto";

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
      public: cheatsheetsTable.public,
      created_at: cheatsheetsTable.created_at,
      updated_at: cheatsheetsTable.updated_at,
    }).from(cheatsheetsTable).where(and(eq(cheatsheetsTable.user_id, userId),eq(cheatsheetsTable.status, 1)));
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured", body: error});
  }
}

/**
 * Cheatsheet bin - where cheatsheets land, before deleted
 * @param userId
 * @param res
 * @returns {Promise<void>}
 */
export async function getCheatsheetBin(userId, res) {
  try {
    const result = await db.select({
      id: cheatsheetsTable.id,
      title: cheatsheetsTable.title,
      description: cheatsheetsTable.description,
      filename: cheatsheetsTable.filename,
      created_at: cheatsheetsTable.created_at,
    }).from(cheatsheetsTable).where(and(eq(cheatsheetsTable.user_id, userId), eq(cheatsheetsTable.status, 0)));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error});
  }
}

/**
 * Get bin size
 * @param userId
 * @param res
 * @returns {Promise<void>}
 */
export async function getCheatsheetBinSize(userId, res) {
  try {
    const result = await db.$count(cheatsheetsTable, and(eq(cheatsheetsTable.user_id, userId), eq(cheatsheetsTable.status, 0)))
    res.status(200).json(result);
  } catch(error) {
    console.error(error);
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
export async function getCheatsheetById(cheatsheetId, req, res) {
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
    }).from(cheatsheetsTable).where(eq(cheatsheetsTable.id, cheatsheetId));
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
    console.log(req.body);
    const userId = req.body.userId;
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
    // console.log(markdown);
    res.status(201).json(result);
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
  try {
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
    const result = await db.update(cheatsheetsTable).set(req.body).where(eq(cheatsheetsTable.id, id));
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
    const doc = await mongodb.collection("cheatsheets").updateOne({"id": id}, {$set: req.body});
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