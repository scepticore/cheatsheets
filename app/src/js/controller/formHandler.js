import {cheatsheetsService as cheatsheetService} from "../services/cheatsheetsService.js";

/**
 *
 */
export function handleFormUpdates(csUUID, form) {
  console.log(form);
  // Listen for changes
  let timer;
  form.addEventListener("selectionchange", (e) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const value = JSON.stringify(e.target.value);
      // const value = e.target.value;
      const field = e.target.id;

      const objectString = `{"${field}": ${value}}`;
      console.log(objectString);
      // store value in database with API call
      const result = await cheatsheetService.updateCheatsheet(csUUID, objectString);
      // if no internetion connection, store value in window.sessionStorage
      // window.sessionStorage.setItem("markdown", value);
    }, 500);
  });
}