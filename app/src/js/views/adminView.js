import {cheatsheetsService} from "../services/cheatsheetsService.js";
import {renderTemplate} from "../utils/templateEngine.js";
import {isAdmin} from "../middleware/auth.js";
import {usersService} from "../services/usersService.js";

export async function showAdminDashboard() {
  if(await isAdmin()) {
    const users = await usersService.getUserList();
    // const cheatsheets = await cheatsheetService.getCheatsheetsAdmin();
    return renderTemplate("admin/index.html", {users});
  } else {
    return renderTemplate("/utils/forbidden.html");
  }
}