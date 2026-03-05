import {drizzle} from "drizzle-orm/libsql";
import {createClient} from "@libsql/client";

console.log("Trying to open DB: ", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not defined!");
}
const client = createClient({
  url: process.env.DATABASE_URL
});

export const db = drizzle(client);