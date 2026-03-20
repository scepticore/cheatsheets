import express from "express";
import {
  getCheatsheets,
  getLatestCheatsheets
} from "../services/cheatsheets.js";

import {authenticateToken} from "../middleware/auth.js";
import {isAdmin} from "../middleware/admin.js";
import {getUsers, getUsersAdmin} from "../services/users.js";

const router = express.Router();


/**
 * Show all cheatsheets for admin
 */
router.get("/cheatsheets", isAdmin, authenticateToken, async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      res.status(400).json({error: "user_id missing"});
    }
    const data = await getCheatsheets(user_id, res);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured"})
  }
});

/**
 * Get latest cheatsheets for admin dashboard
 */
router.get("/cheatsheets/latest", authenticateToken, async (req, res) => {
  try {
    const data = await getLatestCheatsheets(user_id, res);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error});
  }
});

/**
 * Get user list for admin
 */
router.get("/users", authenticateToken, async (req, res) => {
  // @todo Get Userlist for admin
  try {
    const adminFlag = await isAdmin(req);
    if(adminFlag) {
      const users = await getUsersAdmin(res);
      res.status(200).json({users});
    } else {
      res.status(403).json({error: "Forbidden"});
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({error: "An error occured", body: e});
  }
});

/**
 * Get certain user for admin
 */
router.get("/users/:id", isAdmin, authenticateToken, async (req, res) => {
  // @todo Get user by id for admin
  try {
    return `User ${req.params.id}`;
  } catch (e) {
    console.error(e);
    res.status(500).json({error: "An error occured", body: e});
  }
});

router.get("/get-ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  res.json({ip});
});

export default router;