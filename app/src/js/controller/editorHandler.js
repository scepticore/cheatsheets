import {debounce} from "../utils/utils";
import {cheatsheetsService} from "../services/cheatsheetsService.js";
/**
 *
 */
export function loadAce(uuid) {
  // Init ace9 editor
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/github_dark");
  editor.session.setMode("ace/mode/markdown");

  // Listen for changes
  let timer;
  editor.session.on("change", function(delta) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      // const field = e.target.id;
      const field = "";
      const value = JSON.stringify(editor.getValue());
      console.log(value);

      const objectString = `{"body": ${value}}`;
      console.log(objectString);
      // store value in database with API call
      const result = await cheatsheetsService.updateCheatsheetMarkdown(uuid, objectString);
      // if no internetion connection, store value in window.sessionStorage
      // window.sessionStorage.setItem("markdown", value);

      const iframe = document.getElementById("cs_frame");
      iframe.src = iframe.src;
    }, 500);
  });
}