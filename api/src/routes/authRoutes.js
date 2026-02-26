import express from "express";
import {loginUser, registerUser, refreshToken} from "../services/auth.js";

const router = express.Router();


/**
 * Sign In
 */
router.post("/signin", loginUser);

/**
 * Sign Up New Users
 */
router.post("/signup", registerUser);

/**
 * Refresh Token
 */
router.post("/refresh", refreshToken);

export default router;