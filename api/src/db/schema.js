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
  role: text().default("user"),
  registered_at: text().notNull().$defaultFn(()=> new Date().toISOString()),
  last_login: text()
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
  created_at: text().notNull().$defaultFn(()=> new Date().toISOString()),
  updated_at: text()
});

export const newsTable = sqliteTable("news_table", {
  id: text().primaryKey(),
  user_id: text().notNull().references(() => usersTable.id),
  title: text(),
  description: text(),
  type: text(),
  updates: text(),
  created_at: text().notNull().$defaultFn(()=> new Date().toISOString()),
  updated_at: text(),
  updated_by: text()
});