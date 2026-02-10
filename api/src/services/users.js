import "dotenv/config";
import {drizzle} from "drizzle-orm/libsql";
import {and, eq, or} from "drizzle-orm";
import {usersTable} from "../db/schema.js";
import * as jose from "jose";
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
            username: usersTable.username
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
 * Get user by credentials, either email or username and password
 * @param req
 * @param res
 */
export async function getUserByCredentials(req, res) {
    try {
        const result = await db.select({
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
            password: usersTable.password
        }).from(usersTable).where(
            and(
                or(
                    req.body.email ? eq(usersTable.email, req.body.email) : eq(usersTable.username, req.body.username),
                )
                , eq(usersTable.password, req.body.password)
            )
        );
        console.log(result);
        if (result.length === 0) {
            res.status(401).json({error: "Invalid credentials"});
        }

        const user = result[0];

        const secretKey = createSecretKey("secret", "utf-8");


        const token = await new SignJWT({
            username: req.body.username
        })
            .setProtectedHeader({
                alg: "HS256",
            })
            .setIssuedAt()
            .setIssuer("Me")
            .setAudience("Audience")
            .setExpirationTime(86400)
            .sign(secretKey);
        console.log(token);
        res.status(200).send(token);


        // res.status(200).json(result);

    } catch (error) {
        console.log(error);
        // @todo edit to send some error message which could be handled by frontend
        res.status(500).send(error);
    }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function createUser(req, res) {
    // const { name, email, password } = req.body;
    // console.log(req);
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const uuid = randomUUID();

        const newUser = {
            "email": req.body.email,
            "username": req.body.username,
            "password": hashedPassword,
            id: uuid
        }
        console.log(newUser);
        const result = await db.insert(usersTable).values(newUser);
        console.log(result);
        res.status(201).json({result});
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