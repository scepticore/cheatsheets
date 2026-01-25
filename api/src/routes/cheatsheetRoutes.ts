import {Router, Request, Response} from "express";
import {
    createCheatsheet,
    getCheatsheets,
    getCheatsheetById,
    updateCheatsheet,
    deleteCheatsheet,
    getCheatsheetMarkdown
} from "../services/cheatsheets";

const router = Router();
const userId = 1;

router.get("/cheatsheets", async (req: Request, res: Response) => {
    try {
        console.log(req.query);
        const user_id = Number(req.query.user_id);
        if (!user_id) {
            res.status(400).json({ error: "user_id missing" });
        }
        const users = await getCheatsheets(user_id, res);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
});

router.post("/cheatsheets/create", async (req: Request, res: Response) => {
    try {
        const result = await createCheatsheet(req, res);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    } finally {
        // Create MongoDB object
    }
});

router.get("/cheatsheet/:id", async (req: Request, res: Response) => {
    try {
        const cheatsheetId = req.params.id;
        const cheatsheet = await getCheatsheetById(userId, cheatsheetId, req, res);
        const markdown = await getCheatsheetMarkdown(cheatsheetId);
        console.log("Markdown: ", markdown);
        res.json({cheatsheet, markdown});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
})

router.put("/cheatsheet/:id/update", async (req: Request, res: Response) => {
    try {
        const users = await updateCheatsheet(req.params.id, req, res);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
})

router.delete("/cheatsheet/:id/delete", async (req: Request, res: Response) => {
    try {
        const result = await deleteCheatsheet(req.params.id, req, res);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "An error occured"})
    }
})

export default router;