import express from "express";
import {getUserByCredentials} from "../services/users.js";

const router = express.Router();

/**
 * Get info from DB
 */
router.post("/authservice", async (req, res) => {
    // get user credentials by id
    const result = await getUserByCredentials(req, res);
    res.status(200).json(result);
});

/**
 * Sign In
 */
router.post("/signin", async (req, res) => {
    // Get User by Username or Email
    // Email in first prio
    res.status(200).json(req.body);
});

/**
 * Sign Up New Users
 */
router.post("/signup", async (req, res) => {
    //
});



export default router;