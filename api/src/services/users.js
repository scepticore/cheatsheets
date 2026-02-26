import "dotenv/config";
import {drizzle} from "drizzle-orm/libsql";
import {and, eq, or} from "drizzle-orm";
import {usersTable} from "../db/schema.js";
import {SignJWT} from "jose";
import {createSecretKey} from "node:crypto";
import {createClient} from "@libsql/client";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

console.log("Trying to open DB: ", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not defined!");
}
const client = createClient({
    url: process.env.DATABASE_URL
});

const db = drizzle(client);


/**
 *
 * @param res
 * @returns {Promise<void>}
 */
export async function getUsers(res) {
    try {
        const result = await db.select({
            id: usersTable.id,
            name: usersTable.name,
            firstname: usersTable.firstname,
            email: usersTable.email,
            username: usersTable.username,
            role: usersTable.role,
        }).from(usersTable);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"});
    }
}

/**
 *
 * @param id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function getUserById(id, req, res) {
    try {
        const result = await db.select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email
        }).from(usersTable).where(eq(usersTable.id, id));
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error});
    }
}

/**
 * Get user by email, to check wether email is already taken or not
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function getUserByEmail(req, res) {

}

/**
 * Get user by username, to check wether username is already taken or not
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function getUserByUsername(req, res) {

}

/**
 *
 * @param id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function updateUser(id, req, res) {
    try {
        const result = await db.update(usersTable).set(req.body).where(eq(usersTable.id, id));
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}

/**
 *
 * @param id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function deleteUser(id, req, res) {
    try {
        const result = await db.delete(usersTable).where(eq(usersTable.id, id));
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}