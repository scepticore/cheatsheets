import express from "express";
import {getUserById, getUsers, updateUser, deleteUser} from "../services/users.js";

const router = express.Router();

/**
 * Get Userlist
 */
router.get("/users", async (req, res) => {
  try {
    const users = await getUsers(res);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
});

/**
 * Get User by ID
 */
router.get("/user/:id", async (req, res) => {
  try {
    const users = await getUserById(parseInt(req.params.id), req, res);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

/**
 * Get User by email
 */
router.get("/mail", async (req, res) => {

});

/**
 * Get User by Username
 */
router.get("/username", async (req, res) => {

});

/**
 * Update User
 */
router.put("/user/:id/update", async (req, res) => {
  try {
    const users = await updateUser(parseInt(req.params.id), req, res);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

/**
 * Delete User
 */
router.delete("/user/:id/delete", async (req, res) => {
  try {
    const result = await deleteUser(parseInt(req.params.id), req, res);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

export default router;