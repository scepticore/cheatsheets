import express from "express";
import {getUserById, getUserRoleById, getUsers, updateUser, deleteUser} from "../services/users.js";
import {authenticateToken} from "../middleware/auth.js";

const router = express.Router();

/**
 * Get Userlist
 */
router.get("/users", async (req, res) => {
  try {
    const users = await getUsers(res);
    res.status(200).json({users});
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
    const user = await getUserById(req.params.id, req, res);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

/**
 * Get user role
 */
router.get("/user/:id/role", authenticateToken, async (req, res) => {
  try {
    const role = await getUserRoleById(req.params.id, req, res);
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error})
  }
});

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