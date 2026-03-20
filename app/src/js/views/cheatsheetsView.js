import {renderTemplate} from "../utils/templateEngine";
import {formGenerator} from "../utils/formBuilder";
import {cheatsheetsService} from "../services/cheatsheetsService";
import {loadAce} from "../controller/editorHandler";
import {handleFormUpdates} from "../controller/formHandler";
import {createCheatsheet} from "../controller/createCheatsheet.js";
import {downloadPdf} from "../controller/downloadPdf.js";
import {OUTPUT_DIR, API_BASE, HOST} from "../constants.js";

/**
 * View own cheatsheets
 * @returns {Promise<void>}
 */
export async function viewCheatsheetList() {
  let cheatsheets = await cheatsheetsService.getCheatsheets();
  cheatsheets.map((cheatsheet) => {
    cheatsheet.image = `${OUTPUT_DIR}${cheatsheet.id}.png`;
    cheatsheet.file = `${OUTPUT_DIR}${cheatsheet.id}.pdf`;
  })
  const bin = await cheatsheetsService.getBinSize();
  await renderTemplate("cheatsheets/index.html", {cheatsheets: cheatsheets, bin: bin});

  // Listen for new cheatsheet button
  createCheatsheet();
}

/**
 * Public cheatsheets
 * @returns {Promise<void>}
 */
export async function viewPublicCheatsheets() {
  const cheatsheets = await cheatsheetsService.getPublicCheatsheets();
  cheatsheets.map((cheatsheet) => {
    cheatsheet.image = `${OUTPUT_DIR}${cheatsheet.id}.png`;
    cheatsheet.file = `${OUTPUT_DIR}${cheatsheet.id}.pdf`;
  })
  await renderTemplate("cheatsheets/public.html", {cheatsheets: cheatsheets});
}

/**
 * View own cheatsheet bin
 * @returns {Promise<void>}
 */
export async function viewCheatsheetBin() {
  const cheatsheets = await cheatsheetsService.getDeletedCheatsheets();
  cheatsheets.map((cheatsheet) => {
    cheatsheet.image = `${OUTPUT_DIR}/${cheatsheet.id}.png`;
  });
  await renderTemplate("cheatsheets/bin.html", {cheatsheets});
}

/**
 * View single cheatsheet, currently loads HTML-Page from API
 * @param id
 * @returns {Promise<void>}
 */
export async function viewCheatsheetDetail(id) {
  let result = await cheatsheetsService.getCheatsheetById(id);
  result.title = result.cheatsheet.title;
  result.url = `${API_BASE}/cheatsheet/${id}/pdf`;
  result.file = `${OUTPUT_DIR}${result.cheatsheet.id}.pdf`;
  return renderTemplate("cheatsheets/detail.html", {result});
}

/**
 * View Cheatsheet Form (same for edit and new cheatsheet)
 * @param id
 * @param userId
 * @returns {Promise<void>}
 */
export async function viewCheatsheetForm(id = null, userId = null) {
  let result = {};
  let cheatsheet = {};
  let markdown = "";

  if(id) {
    result = await cheatsheetsService.getCheatsheetById(id);
    if (userId && result.cheatsheet.user_id !== userId ) {
      console.error("Access denied");
      return renderTemplate("utils/forbidden.html");
    }
    cheatsheet = result.cheatsheet;
    cheatsheet.url = `${API_BASE}/cheatsheet/${id}/pdf`;
    cheatsheet.image = `${API_BASE}/output/${id}.png`;
    cheatsheet.file = `${API_BASE}/output/${id}.pdf`;
    cheatsheet.checked = result.cheatsheet?.public ? `checked="true"` : "";
    markdown = result.markdown ? result.markdown.body : "";
    cheatsheet.titleLength = result.cheatsheet.title.length;
    cheatsheet.descriptionLength = result.cheatsheet.description.length;
  }

  await renderTemplate("cheatsheets/form.html", {markdown, cheatsheet}, true);

  loadAce(id);
  const form = document.getElementById("cheatsheet_edit");
  handleFormUpdates(id, form);
  downloadPdf();
}

export function viewCheatsheetPreview() {
  return renderTemplate("cheatsheets/preview.html", {}, true);
}