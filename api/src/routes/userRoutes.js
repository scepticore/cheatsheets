import express from "express";
import {createUser, getUserById, getUsers, updateUser, deleteUser,} from "../services/users.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await getUsers(res);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
});

router.post("/users/create", async (req, res) => {
    try {
        const result = await createUser(req, res);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const users = await getUserById(parseInt(req.params.id), req, res);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
})

router.put("/user/:id/update", async (req, res) => {
    try {
        const users = await updateUser(parseInt(req.params.id), req, res);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
})

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