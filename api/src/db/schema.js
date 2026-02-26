import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

/**
 * usersTable for Drizzle
 */
export const usersTable = sqliteTable("users_table", {
  id: text().primaryKey(),
  name: text(),
  firstname: text(),
  email: text().notNull().unique(),
  username: text().notNull().unique(),
  password: text().notNull(),
  role: text() || "user"
});

/**
 * cheatsheetsTable for Drizzle
 */
export const cheatsheetsTable = sqliteTable("cheatsheet_table", {
  id: text().primaryKey(),
  user_id: text().notNull().references(() => usersTable.id),
  title: text(),
  description: text(),
  filename: text(),
  columns: integer(),
  font_size: integer(),
  status: integer().default(1),
  public: integer({ mode: 'boolean'}),
  created_at: text().default(sql`(current_timestamp)`).notNull(),
  updated_at: text()
});