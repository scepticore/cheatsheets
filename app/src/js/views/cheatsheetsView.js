import {renderTemplate} from "../utils/templateEngine";
import {formGenerator} from "../utils/formBuilder";
import {cheatsheetsService} from "../services/cheatsheetsService";
import {loadAce} from "../controller/editorHandler";
import {handleFormUpdates} from "../controller/formHandler";
import {createCheatsheet} from "../controller/createCheatsheet.js";

export async function viewCheatsheetList() {
  const cheatsheets = await cheatsheetsService.getCheatsheets();
  await renderTemplate("cheatsheets/index.html", {cheatsheets: cheatsheets.data});

  // Listen for new cheatsheet button
  createCheatsheet();
}

/**
 * View single cheatsheet, currently loads HTML-Page from API
 * @param id
 * @returns {Promise<void>}
 */
export function viewCheatsheetDetail(id) {
  const result = {};
  result.id = id;
  return renderTemplate("cheatsheets/detail.html", {result});
}

/**
 * View Cheatsheet Form (same for edit and new cheatsheet)
 * @param id
 * @returns {Promise<void>}
 */
export async function viewCheatsheetForm(id = null) {
  let result = {};
  let markdown = "";
  let title = "Create new cheatsheet";
  let callback = "window.cheatsheetsService.createCheatsheet()";

  if(id) {
    result = await cheatsheetsService.getCheatsheetById(id);
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
        "attr": {
          "checked": result.cheatsheet?.public === 1 ? "checked" : undefined,
        }
      }
    });

  await renderTemplate("cheatsheets/form.html", {title, markdown, form, cheatsheet: result.cheatsheet}, true);

  loadAce(id);
  handleFormUpdates(id, form);
}

export function viewCheatsheetPreview() {
  return renderTemplate("cheatsheets/preview.html", {}, true);
}