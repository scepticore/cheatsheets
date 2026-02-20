import {cheatsheetsService as cheatsheetService} from "../services/cheatsheetsService.js";

/**
 * Listens to form changes for cheatsheet editor
 */
export function handleFormUpdates(csUUID, form) {
  // Listen for changes
  let timer;

  // Inputs
  form.addEventListener("selectionchange", (e) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const value = JSON.stringify(e.target.value);
      const field = e.target.id;
      const objectString = `{"${field}": ${value}}`;

      const result = await cheatsheetService.updateCheatsheet(csUUID, objectString);

      // @todo backup if internet connection fails
      // if no internetion connection, store value in window.sessionStorage
      // window.sessionStorage.setItem("markdown", value);
    }, 1000);
  });

  // @todo make checkboxes work for autosave
  // Checkboxes
  form.addEventListener("change", async (e) => {
    // console.log(e);
    const value = e.target.value;
    const field = e.target.id;
    console.log(field);
    console.log(value);
    const objectString = `{"${field}": ${value}}`;
    const result = await cheatsheetService.updateCheatsheet(csUUID, objectString);

    const iframe = document.getElementById("cs_frame");
    iframe.src = iframe.src;
  });
}