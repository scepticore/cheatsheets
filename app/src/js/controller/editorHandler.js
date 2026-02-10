import {cheatsheetsService} from "../services/cheatsheetsService.js";
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
      const value = JSON.stringify(editor.getValue());
      const objectString = `{"body": ${value}}`;

      // store value in database with API call
      const result = await cheatsheetsService.updateCheatsheetMarkdown(uuid, objectString);
      // @todo backup if internet connection fails
      // if no internetion connection, store value in window.sessionStorage
      // window.sessionStorage.setItem("markdown", value);

      const iframe = document.getElementById("cs_frame");
      iframe.src = iframe.src;
    }, 500);
  });
}