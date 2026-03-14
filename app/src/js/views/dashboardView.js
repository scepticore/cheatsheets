import {renderTemplate} from "../utils/templateEngine";
import {cheatsheetsService} from "../services/cheatsheetsService.js";
import {HOST, OUTPUT_DIR} from "../constants.js";

export async function showStart() {
  const hostUrl = HOST;
  const cheatsheets = await cheatsheetsService.getPublicCheatsheets(3);
  cheatsheets.map((cheatsheet) => {
    cheatsheet.image = `${OUTPUT_DIR}/${cheatsheet.id}.png`;
    cheatsheet.file = `${OUTPUT_DIR}${cheatsheet.id}.pdf`;
  })

  await renderTemplate("dashboard/start.html", {hostUrl, cheatsheets});
}

export async function showDashboard() {
  const latestCheatsheets = await cheatsheetsService.getLatestCheatsheets();
  await renderTemplate("dashboard/index.html", {latestCheatsheets});
}