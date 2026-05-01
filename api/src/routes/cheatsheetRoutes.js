import express from "express";
import {
  createCheatsheet,
  getCheatsheets,
  getCheatsheetById,
  updateCheatsheet,
  deleteCheatsheet,
  getCheatsheetMarkdown, updateMarkdown, getCheatsheetBin, getCheatsheetBinSize, getPublicCheatSheets,
  getLatestCheatsheets
} from "../services/cheatsheets.js";
import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import markedKatex from "marked-katex-extension";
import hljs from "highlight.js";

import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {authenticateToken} from "../middleware/auth.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();


/**
 * Cheatsheet Route, shows own cheatsheets
 */
router.get("/cheatsheets", authenticateToken, async (req, res) => {
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
 * Get latest cheatsheets by user
 */
router.get("/cheatsheets/latest", authenticateToken, async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      res.status(400).json({error: "user_id missing"});
    }

    const data = await getLatestCheatsheets(user_id, res);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error});
  }
});

router.get("/cheatsheets/public", async(req, res) => {
  try {
    const result = await getPublicCheatSheets(req.query.limit);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error});
  }
});

/**
 * Get cheatsheet bin
 */
router.get("/cheatsheets/bin", authenticateToken, async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      res.status(400).json({error: "user_id missing"});
    }

    const data = await getCheatsheetBin(user_id, res);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error})
  }
});

/**
 * Get cheatsheet bin size
 */
router.get("/cheatsheets/bin/size", authenticateToken, async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      res.status(400).json({error: "user_id missing"});
    }

    const binSize = await getCheatsheetBinSize(user_id, res);
    res.status(200).json(binSize);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error})
  }
});

/**
 * Create new cheatsheet
 */
router.post("/cheatsheets/create", authenticateToken, async (req, res) => {
  try {
    const result = await createCheatsheet(req, res);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error})
  }
});

/**
 * View single cheatsheet by ID
 */
router.get("/cheatsheet/:id", async (req, res) => {
  try {
    // @todo add userId
    const cheatsheetId = req.params.id;
    const cheatsheet = await getCheatsheetById(cheatsheetId, req, res);
    res.status(200).json(cheatsheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error})
  }
})

/**
 * Get cheatsheet markdown from MongoDB
 */
router.get("/cheatsheet/:id/markdown", authenticateToken, async (req, res) => {
  try {
    const cheatsheedId = req.params.id;
    const markdown = await getCheatsheetMarkdown(cheatsheedId);
    res.status(200).json(markdown);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occured", body: error})
  }
});

/**
 * Update markdown in MongoDB
 */
router.put("/cheatsheet/:id/markdown/update", authenticateToken, async (req, res) => {
  try {
    const cheatsheetId = req.params.id;
    const result = await updateMarkdown(cheatsheetId, req, res);
    res.status(result.modifiedCount);
  } catch (error) {
    console.log(error);
  }
})

/**
 * Get PDF-Ready HTML-View
 * @todo move to services
 */
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

  const options = {
    nonStandard: true,
    output: 'html'
  };

  marked.use(markedKatex(options));

  try {
    // @todo add userId for cheatsheetMeta
    const cheatsheetMeta = await getCheatsheetById(id, req, res);
    const markdownData = await getCheatsheetMarkdown(id);
    const contentHtml = await marked.parse(markdownData?.body || "");
    const paginatedHtml = paginateMarkdown(contentHtml);

    const cssPath = path.join(__dirname, "../shared_css/preview.css");
    const styles = await fs.readFile(cssPath, "utf-8");

    const fullHtml = `
    <!DOCTYPE html>
   <html>
   <head>
   <title>${id}</title>
    <meta name="viewport" content="width=device-width, initial-scale=0.2, maximum-scale=1.0, user-scalable=no" />
    <style>
      * {
      font-size: ${cheatsheetMeta.font_size}pt !important;
      }
      .page {
        column-count: ${cheatsheetMeta.columns};
      }
      ${styles}
      ${darculaTheme}
      pre {
        break-inside: avoid;
        page-break-inside: avoid;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    </head>
    <body>
      ${paginatedHtml}
<script>
(function() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("search");
  if (!search) {
    window.parent.postMessage({ type: "SCROLL_DONE" }, "*");
    return;
  }

  const terms = decodeURIComponent(search).toLowerCase().split(" ");

  function findMatch() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;

    while (node = walker.nextNode()) {
      const text = node.textContent.toLowerCase();
      if (terms.every(t => text.includes(t))) {
        const el = node.parentElement;

        el.scrollIntoView({
          behavior: "instant",
          block: "center"
        });

        el.style.background = "yellow";
        return true;
      }
    }
    return false;
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      findMatch();
      window.parent.postMessage({ type: "SCROLL_DONE" }, "*");
    }, 100);
  });
})();
</script>
    </body>
   </html>
   `
    res.send(fullHtml);
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occured");
  }
});

/**
 * Update cheatsheet SQLite
 */
router.put("/cheatsheet/:id/update", authenticateToken, async (req, res) => {
  try {
    const users = await updateCheatsheet(req.params.id, req, res);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

/**
 * Delete cheatsheet
 */
router.delete("/cheatsheet/:id/delete", authenticateToken, async (req, res) => {
  try {
    const result = await deleteCheatsheet(req.params.id, req, res);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occured"})
  }
})

/**
 * Helper function: Paginate markdown, so each H1 starts a new page
 * @param htmlString
 * @returns {string}
 */
function paginateMarkdown(htmlString) {
  const sections = htmlString.split(/(?=<h[1-6]>)/g);

  let result = "";
  let isInsidePage = false;

  sections.forEach(section => {
    if (section.trim() === "") return;
    if (section.startsWith("<h1>")) {
      if (isInsidePage) {
        result += `</div>`;
      }
      result += `<div class="page">`;
      isInsidePage = true;
    }

    result += `<div class="paragraph">${section}</div>`;
  });

  if (isInsidePage) {
    result += `</div>`;
  }

  return result;
}

export default router;