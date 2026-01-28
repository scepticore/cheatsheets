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

export default router;