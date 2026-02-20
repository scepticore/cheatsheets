import {MongoClient} from "mongodb";

const uri = process.env.MONGO_URL || "mongodb://localhost:27017/cheatsheets";
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
});

let db = null;

export async function getMongoClient() {
  if (!db) {
    await client.connect();
    db = client.db("cheatsheets");
    console.log("Connected to MongoDB");
  }
  return db;
}