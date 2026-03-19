import {authService} from "../services/authService.js";
import {renderTemplate} from "../utils/templateEngine.js";

export async function isAdmin() {
  const isAdmin = await authService.isAdmin(sessionStorage.getItem("userId"));
  console.log(isAdmin);
  if (isAdmin) {
    return true;
  } else {
    return renderTemplate("/utils/forbidden.html");
  }
}

export function isLoggedIn() {
  if (window.sessionStorage.getItem("token") && sessionStorage.getItem("userId")) {
    return true;
  } else {
    window.location.href = "/signin";
  }
}