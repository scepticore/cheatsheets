import {cheatsheetsService} from "../services/cheatsheetsService.js";

/**
 * Reacts to create cheatsheet button
 * Triggers cheatsheetsService to create a new cheatsheet
 */
export function createCheatsheet() {
  const button = document.getElementById("createNewCheatsheet");
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    await cheatsheetsService.createCheatsheet();
  });
}