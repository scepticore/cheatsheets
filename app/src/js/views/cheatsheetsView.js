import {renderTemplate} from "../utils/templateEngine";
import {formGenerator} from "../utils/formBuilder";
import {cheatsheetsService} from "../services/cheatsheetsService";
import {loadAce} from "../controller/editorHandler";
import {handleFormUpdates} from "../controller/formHandler";
import {createCheatsheet} from "../controller/createCheatsheet.js";
import {downloadPdf} from "../controller/downloadPdf.js";
import {API_BASE, HOST} from "../constants.js";

export async function viewCheatsheetList() {
  const cheatsheets = await cheatsheetsService.getCheatsheets();
  await renderTemplate("cheatsheets/index.html", {cheatsheets: cheatsheets});

  // Listen for new cheatsheet button
  createCheatsheet();
}

export async function viewPublicCheatsheets() {
  const cheatsheets = await cheatsheetsService.getPublicCheatsheets();
  await renderTemplate("cheatsheets/public.html", {cheatsheets: cheatsheets});
}

/**
 * View single cheatsheet, currently loads HTML-Page from API
 * @param id
 * @returns {Promise<void>}
 */
export function viewCheatsheetDetail(id) {
  let result = {};
  result.id = id;
  result.url = `${API_BASE}/cheatsheet/{{ result.id }}/pdf`;
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
  let markdown = "";
  let title = "Create new cheatsheet";
  let callback = "window.cheatsheetsService.createCheatsheet()";

  if(id) {
    result = await cheatsheetsService.getCheatsheetById(id);
    if (userId && result.cheatsheet.user_id !== userId ) {
      console.error("Access denied");
      return renderTemplate("utils/forbidden.html");
    }
    result.url = `${API_BASE}/cheatsheet/${id}/pdf`;
    markdown = result.markdown ? result.markdown.body : "";
    title = "Edit cheatsheet";
    callback = "window.cheatsheetsService.updateCheatsheet()";
  }

  const form = new formGenerator(null,
    {
      "callback":  callback
    },
    {
      "title": {
        "type": "text",
        "attr": {
          "maxLength": 100,
          "required": false,
          "class": "first_class second_class",
          "value": result.cheatsheet ? result.cheatsheet.title : "",
        },
      },
      "description": {
        "type": "textarea",
        "content": result.cheatsheet ? result.cheatsheet.description : "",
        "attr": {
          "maxLength": 500
        }
      },
      "public": {
        "type": "checkbox",
        "checked": result.cheatsheet?.public,
      },
      "columns": {
        "type": "range",
        "attr": {
          "min": 1,
          "max": 5,
          "value": result.cheatsheet?.columns ? result.cheatsheet.columns : "",
        }
      },
      "font_size": {
        "type": "range",
        "attr": {
          "min": 5,
          "max": 12,
          "value": result.cheatsheet?.font_size ? result.cheatsheet.font_size : 10,
        }
      }
    });

  await renderTemplate("cheatsheets/form.html", {title, markdown, form, cheatsheet: result}, true);

  loadAce(id);
  handleFormUpdates(id, form);
  downloadPdf();
}

export function viewCheatsheetPreview() {
  return renderTemplate("cheatsheets/preview.html", {}, true);
}