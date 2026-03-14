import {Router} from "./js/utils/router.js";
import {checkDarkMode} from "./js/controller/darkmodeHandler";
import {deleteHandler} from "./js/controller/deleteHandler";
import {showStart, showDashboard} from "./js/views/dashboardView";
import {
  viewCheatsheetForm,
  viewCheatsheetDetail,
  viewCheatsheetList, viewCheatsheetPreview, viewPublicCheatsheets, viewCheatsheetBin
} from "./js/views/cheatsheetsView";
import {showPreview} from "./js/views/previewView";
import {formSignIn, formSignUp} from "./js/views/usersView";
import {renderTemplate} from "./js/utils/templateEngine.js";
import {isLoggedIn} from "./js/middleware/auth.js";
import {getUserName} from "./js/controller/appHandler.js";
import {authService} from "./js/services/authService.js";
import {restoreHandler} from "./js/controller/restoreHandler.js";

// AppController
checkDarkMode();

const router = new Router();

const mainframe = document.getElementById("mainframe");

router.add("/preview/:id", async(params) => {
  return showPreview(params.id);
});

router.add("/", async () => {
  return showStart();
});

router.add("/dashboard", isLoggedIn, async () => {
  return showDashboard();
});

/* Cheatsheet Routes */
router.add("/cheatsheets", isLoggedIn, async () => {
  await viewCheatsheetList();
  await deleteHandler();
});

router.add("/cheatsheets/bin", isLoggedIn, async () => {
  await viewCheatsheetBin();
  await restoreHandler();
});

router.add("/cheatsheets/:id", (params) => {
  return viewCheatsheetDetail(params.id);
});

router.add("/cheatsheets/:id/edit", isLoggedIn, (params) => {
  return viewCheatsheetForm(params.id, sessionStorage.getItem("userId"));
});

router.add("/cheatsheets/:id/delete", isLoggedIn, (params) => {
  mainframe.innerHTML = `<h1>Cheatsheet Delete #${params.id}</h1>`;
});

/* Public cheatsheets */
router.add("/community", () => {
  return viewPublicCheatsheets();
});

/* Examples routes */
router.add("/examples", () => {
  mainframe.innerHTML = "<h1>Example codes</h1>";
});

/* Help routes */
router.add("/help", () => {
  // mainframe.innerHTML = "<h1>Need help?</h1>";
  return renderTemplate("app/help.html");
});

/* Account routes */
router.add("/account", () => {
  mainframe.innerHTML = "<h1>My Account</h1>";
});

router.add("/account/edit", () => {
  mainframe.innerHTML = "<h1>Edit Account</h1>";
});

router.add("/account/delete", () => {
  mainframe.innerHTML = "<h1>Delete my Account</h1>";
});

/* Auth routes */
router.add("/signin", () => {
  return formSignIn();
});

router.add("/signup", () => {
  return formSignUp();
});

router.add("/signout", () => {
  return authService.signOut();
});

/* Admin Routes */
router.add("/admin/users", () => {
  mainframe.innerHTML = "<h1>Users</h1>";
});

/* PDF Debugger */
router.add("/cheatsheet_pdf", () => {
  return viewCheatsheetPreview();
});

// Controllers
getUserName();