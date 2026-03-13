import {renderTemplate} from "../utils/templateEngine";
import {cheatsheetsService} from "../services/cheatsheetsService.js";

export async function showStart() {
  await renderTemplate("dashboard/start.html");
}

export async function showDashboard() {
  const latestCheatsheets = await cheatsheetsService.getLatestCheatsheets();
  await renderTemplate("dashboard/index.html", {latestCheatsheets});
}