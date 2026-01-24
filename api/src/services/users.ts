import "dotenv/config";
import {drizzle} from "drizzle-orm/libsql";
import {and, eq, or} from "drizzle-orm";
import {Response, Request, NextFunction} from "express";
import {usersTable} from "../db/schema";
import * as jose from "jose";
import {SignJWT} from "jose";
import {createSecretKey} from "node:crypto";

const db = drizzle(process.env.DB_FILE_NAME!);

export async function getUsers(res: Response) {
    try {
        const result = await db.select({
            id: usersTable.user_id,
            name: usersTable.name,
            firstname: usersTable.firstname,
            email: usersTable.email,
            username: usersTable.username,
            password: usersTable.password,
        }).from(usersTable);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"});
    }
}

export async function getUserById(id: number, req: Request, res: Response) {
    try {
        const result = await db.select({
            id: usersTable.user_id,
            name: usersTable.name,
            email: usersTable.email
        }).from(usersTable).where(eq(usersTable.user_id, id));
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
export async function getUserByCredentials(req: Request, res: Response) {
    try {
        const result = await db.select({
            id: usersTable.user_id,
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

export async function createUser(req: Request, res: Response) {
    // const { name, email, password } = req.body;
    // console.log(req);
    try {
        const result = await db.insert(usersTable).values(req.body);
        console.log(result);
        res.status(201).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}

export async function updateUser(id: number, req: Request, res: Response) {
    try {
        const result = await db.update(usersTable).set(req.body).where(eq(usersTable.user_id, id));
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}

export async function deleteUser(id: number, req: Request, res: Response) {
    try {
        const result = await db.delete(usersTable).where(eq(usersTable.user_id, id));
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
}