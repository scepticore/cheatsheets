import express from "express";
import {loginUser, registerUser} from "../services/auth.js";

const router = express.Router();


/**
 * Sign In
 */
router.post("/signin", loginUser);

/**
 * Sign Up New Users
 */
router.post("/signup", registerUser);

export default router;