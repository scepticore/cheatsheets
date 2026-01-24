import {Router, Request, Response} from "express";
import {getUserByCredentials} from "../services/users";


const router = Router();

/**
 * Get info from DB
 */
router.post("/authservice", async (req: Request, res: Response) => {
    // get user credentials by id
    const result = await getUserByCredentials(req, res);
    res.status(200).json(result);
});

export default router;