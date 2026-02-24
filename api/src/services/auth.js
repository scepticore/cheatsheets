import "dotenv/config";
import { db } from "../utils/db.js";
import {usersTable} from "../db/schema.js";
import {eq} from "drizzle-orm";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";


/**
 * Create new user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function registerUser(req, res) {
  const { username, password, email } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(500).json({error: "Missing required fields"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
      id: crypto.randomUUID(),
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({message: "User created"});
  } catch (error) {
    console.error(error.cause);
    res.status(400).json({error: "User not created"});
  }
}

/**
 * Authenticate user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!process.env.JWT_SECRET) {
      throw new Error("Missing JWT secret");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const user = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({error: "Invalid credentials"});
    }

    const token = await new SignJWT({ userId: user.id, role: 'user'})
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret)

    res.json({token, username: user.username});
  } catch (error) {
    console.error(error);
  }
}