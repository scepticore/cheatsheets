import express from "express";
import {
  createCheatsheet,
  getCheatsheets,
  getCheatsheetById,
  updateCheatsheet,
  deleteCheatsheet,
  getCheatsheetMarkdown, updateMarkdown
} from "../services/cheatsheets.js";
import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";

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

router.put("/cheatsheet/:id/markdown/update", async (req, res) => {
  try {
    const cheatsheetId = req.params.id;
    const result = await updateMarkdown(cheatsheetId, req, res);
  } catch (error) {
    console.log(error);
  }
})

router.get("/cheatsheet/:id/pdf", async (req, res) => {
  const {id} = req.params;
  const darculaTheme = `
  .hljs { display: block; overflow-x: auto; padding: 1em; background: #2b2b2b; color: #a9b7c6; border-radius: 4px; }
  .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #cc7832; }
  .hljs-function, .hljs-code, .hljs-title { color: #ffc66d; }
  .hljs-string, .hljs-attribute { color: #6a8759; }
  .hljs-number, .hljs-symbol, .hljs-bullet { color: #6897bb; }
  .hljs-comment, .hljs-quote { color: #808080; font-style: italic; }
  pre { margin: 0; background: #2b2b2b; }
`;

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, {language}).value
      }
    })
  )



  try {
    const markdownData = await getCheatsheetMarkdown(id);
    const contentHtml = await marked.parse(markdownData?.body || "");
    const paginatedHtml = paginateMarkdown(contentHtml);

    const cssPath = path.join(__dirname, "../shared_css/preview.css");
    const styles = await fs.readFile(cssPath, "utf-8");

    const fullHtml = `
   <html>
   <head>
   <title>${id}</title>
    <meta name="viewport" content="width=device-width, initial-scale=0.2, maximum-scale=1.0, user-scalable=no" />
    <style>
      ${styles}
      ${darculaTheme}
      pre {
        break-inside: avoid;
        page-break-inside: avoid;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      </style>
    </head>
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
  // 1. Wir splitten bei JEDER Überschrift (h1-h6)
  const sections = htmlString.split(/(?=<h[1-6]>)/g);

  let result = "";
  let isInsidePage = false;

  sections.forEach(section => {
    if (section.trim() === "") return;

    // Wenn eine H1 kommt, müssen wir ggf. die vorherige Seite schließen
    if (section.startsWith("<h1>")) {
      if (isInsidePage) {
        result += `</div>`; // Schließt die vorherige <div class="page">
      }
      result += `<div class="page">`;
      isInsidePage = true;
    }

    // Jede Sektion (egal welche H-Ebene) wird in einen Paragraph gepackt
    result += `<div class="paragraph">${section}</div>`;
  });

  // Am Ende den letzten Page-Container schließen
  if (isInsidePage) {
    result += `</div>`;
  }

  return result;
}
// function paginateMarkdown(htmlString) {
//   const sections = htmlString.split(/(?=<h1>)/g);
//   const paginated = sections.map(section => {
//     if (section.trim() === "") return "";
//     return `<div class="page">${section}</div>`;
//   })
//     .join("");
//
//   return paginated;
// }

export default router;