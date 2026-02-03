import {cheatsheetsService} from "../services/cheatsheetsService.js";

export function createCheatsheet() {
  const button = document.getElementById("createNewCheatsheet");
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    await cheatsheetsService.createCheatsheet();
  });
}