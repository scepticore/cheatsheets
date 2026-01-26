import express from "express";
import {
  createCheatsheet,
  getCheatsheets,
  getCheatsheetById,
  updateCheatsheet,
  deleteCheatsheet,
  getCheatsheetMarkdown
} from "../services/cheatsheets.js";
import {marked} from "marked";
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();
const userId = "700a71fb-9f0e-4bf4-9f86-41c66ada062e";

router.get("/cheatsheets", async (req, res) => {
  try {
    console.log(req.query);
    const user_id = req.query.user_id;
    if (!user_id) {
      res.status(400).json({error: "user_id missing"});
    }
    const users = await getCheatsheets(user_id, res);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
});

router.post("/cheatsheets/create", async (req, res) => {
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

router.get("/cheatsheet/:id", async (req, res) => {
  try {
    const cheatsheetId = req.params.id;
    const cheatsheet = await getCheatsheetById(userId, cheatsheetId, req, res);
    res.json(cheatsheet);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

router.get("/cheatsheet/:id/markdown", async (req, res) => {
  try {
    const cheatsheedId = req.params.id;
    const markdown = await getCheatsheetMarkdown(cheatsheedId);
    res.json(markdown);
  } catch (error) {
    console.log(error);
  }
});

router.get("/cheatsheet/:id/pdf", async (req, res) => {
  const {id} = req.params;

  const markdownData = await getCheatsheetMarkdown(id);

  const contentHtml = await marked.parse(markdownData?.body);
  const paginatedHtml = paginateMarkdown(contentHtml);

  try {
    const cssPath = path.join(__dirname, "../shared_css/preview.css");
    const styles = await fs.readFile(cssPath, "utf-8");

    const fullHtml = `
   <html>
   <head><style>${styles}</style></head>
   <body>${paginatedHtml}</body>
   </html>
   `
    res.send(fullHtml);
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occured");
  }

});

router.put("/cheatsheet/:id/update", async (req, res) => {
  try {
    const users = await updateCheatsheet(req.params.id, req, res);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

router.delete("/cheatsheet/:id/delete", async (req, res) => {
  try {
    const result = await deleteCheatsheet(req.params.id, req, res);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

function paginateMarkdown(htmlString) {
  const sections = htmlString.split(/(?=<h1>)/g);
  const paginated = sections.map(section => {
    if (section.trim() === "") return "";
    return `<div class="page">${section}</div>`;
  })
    .join("");

  return paginated;
}

export default router;