import {Router} from "./js/utils/router.js";

import {checkDarkMode} from "./js/controller/darkmodeHandler";
import {showDashboard} from "./js/views/dashboardView";
import {
  viewCheatsheetForm,
  viewCheatsheetDetail,
  viewCheatsheetEdit,
  viewCheatsheetList, viewCheatsheetPreview
} from "./js/views/cheatsheetsView";
import {showPreview} from "./js/views/previewView";
//
checkDarkMode();

const router = new Router();

const mainframe = document.getElementById("mainframe");

router.add("/preview/:id", async(params) => {
  return showPreview();
});

router.add("/", async () => {
  return showDashboard();
});

router.add("/dashboard", () => {
  return showDashboard();
});

/* Cheatsheet Routes */
router.add("/cheatsheets", () => {
  return viewCheatsheetList();
  // mainframe.innerHTML = "<h1>Your personal cheatsheets</h1>";
  // mainframe.innerHTML += "<p><a href='/cheatsheets/new/' title='Create new cheatsheet' class='button'>Create new</a></p>";
});

router.add("/cheatsheets/new", () => {
  return viewCheatsheetForm();
  // mainframe.innerHTML = "<h1>Create new cheatsheet</h1>";
  // mainframe.innerHTML += "<div id='cs_wrapper'><div id='cs_editor'>#Title<br>- List<br>- List<br>Normal text and stuff. Hehe.</div><div id='cs_preview'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem inventore ipsam molestiae, odit officiis quia soluta sunt! Aliquid, aperiam doloribus ex facere, fugit necessitatibus nisi placeat quidem quod repellendus totam.</div></div>";
});

router.add("/cheatsheets/:id", (params) => {
  return viewCheatsheetDetail(params.id);
  // mainframe.innerHTML = `<h1>Cheatsheet ID #${params.id}</h1>`;
});

router.add("/cheatsheets/:id/edit", (params) => {
  return viewCheatsheetForm(params.id);
});

router.add("/cheatsheets/:id/delete", (params) => {
  mainframe.innerHTML = `<h1>Cheatsheet Delete #${params.id}</h1>`;
});

/* Examples routes */
router.add("/examples", () => {
  mainframe.innerHTML = "<h1>Example codes</h1>";
});

/* Help routes */
router.add("/help", () => {
  mainframe.innerHTML = "<h1>Need help?</h1>";
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
router.add("/login", () => {
  mainframe.innerHTML = "<h1>Login</h1>";
});

router.add("/logout", () => {
  mainframe.innerHTML = "<h1>Logout</h1>";
});

/* Admin Routes */
router.add("/admin/users", () => {
  mainframe.innerHTML = "<h1>Users</h1>";
});

/* PDF Debugger */
router.add("/cheatsheet_pdf", () => {
  return viewCheatsheetPreview();
});
