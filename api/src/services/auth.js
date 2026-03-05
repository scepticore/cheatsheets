import { db } from "../utils/db.js";
import {usersTable} from "../db/schema.js";
import {eq} from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

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
    console.log(process.env.JWT_REFRESH_SECRET);
    console.log(refreshSecret);

    const user = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({error: "Invalid credentials"});
    }

    const token = await new SignJWT({ userId: user.id, role: user.role || 'user', username: user.username })
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    const refreshToken = await new SignJWT({ userId: user.id })
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(refreshSecret);

    return res.json({
      token,
      refreshToken,
      username: user.username,
      userId: user.id,
      role: user.role || "user"
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Takes refresh token and returns a new access token
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function refreshToken(req, res) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401);

  try {
    const { payload } = await jwtVerify(refreshToken, refreshSecret);

    const newAccessToken = await new SignJWT({ userId: payload.userId, role: payload.role, username: payload.username })
      .setProtectedHeader({alg: 'HS256'})
      .setExpirationTime('15m')
      .sign(secret);

    res.json({ token: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403);
  }
}