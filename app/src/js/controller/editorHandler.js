import {cheatsheetsService} from "../services/cheatsheetsService.js";
import {API_BASE} from "../constants.js";
/**
 * Loading ACE editor
 */
export function loadAce(uuid) {
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/github_dark");
  editor.session.setMode("ace/mode/markdown");

  let timer;
  editor.session.on("change", function(delta) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const value = editor.getValue();
      const objectString = `{"body": ${JSON.stringify(value)}}`;
      const currentMarkdown = await cheatsheetsService.getCheatsheetMarkdown(uuid);
      const snippet = getNewText(currentMarkdown.body, value);
      await cheatsheetsService.updateCheatsheetMarkdown(uuid, objectString);

      setTimeout(() => {
        const iframe = document.getElementById("cs_frame");
        const overlay = document.getElementById("iframe-overlay");
        overlay.classList.remove("hidden");

        window.addEventListener("message", (e) => {
          if (e.data?.type === "SCROLL_DONE") {
            const overlay = document.getElementById("iframe-overlay");
            overlay.classList.add("hidden");
          }
        });
        let targetUrl = "";
        if (snippet && snippet.length >= 1) {
          const words = snippet
            .replace(/[^a-zA-Z0-9À-ž]/g, ' ')
            .trim()
            .split(/\s+/)
            .filter(w => w.length > 2);

          if (words.length >= 1) {
            const searchTerms = `${words[0]} ${words[1]}`;
            const timestamp = new Date().getTime();
            const encoded = encodeURIComponent(searchTerms);
            targetUrl = `${API_BASE}/cheatsheet/${uuid}/pdf?t=${timestamp}&search=${encoded}`;
          }
        } else {
          targetUrl = `${API_BASE}/cheatsheet/${uuid}/pdf`;
        }

        iframe.contentWindow.location.replace(targetUrl);

        setTimeout(() => {
          iframe.contentWindow.focus();
          editor.focus();
        });
      }, 1000);
    }, 1000);
  });
}

function getNewText(currentMarkdown, newMarkdown) {
  if(!currentMarkdown) return newMarkdown.substring(0, 50);
  let i = 0;
  while (i < currentMarkdown.length && i < newMarkdown.length && currentMarkdown[i] === newMarkdown[i]) {
    i++;
  }

  const diff = newMarkdown.substring(i, i + 100).trim();
  return diff.split(' ').slice(0, 5).join(' ');
}