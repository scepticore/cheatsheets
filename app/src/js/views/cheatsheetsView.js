import {renderTemplate} from "../utils/templateEngine";
import {formGenerator} from "../utils/formBuilder";
import {cheatsheetsService} from "../services/cheatsheetsService";


export async function viewCheatsheetList() {
  const result = {};
  const cheatsheets = await cheatsheetsService.getCheatsheets();

  console.log(cheatsheets);
  return renderTemplate("cheatsheets/index.html", {cheatsheets: cheatsheets.data});
}

export function viewCheatsheetDetail(id) {
  const result = {}; // await getCheatsheetList();
  result.id = id;
  return renderTemplate("cheatsheets/detail.html", {result});
}

export async function viewCheatsheetForm(id = null) {
  let result = {};
  let markdown = "";
  let callback = "window.cheatsheetsService.createCheatsheet()";

  if(id) {
    result = await cheatsheetsService.getCheatsheetById(id);
    markdown = result.markdown ? result.markdown.body : "";
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
          "value": result.cheatsheet.title ? result.cheatsheet.title : "",
        },
      },
      "description": {
        "type": "textarea",
        "content": result.cheatsheet.description ? result.cheatsheet.description : "",
        "attr": {
          "maxLength": 500
        }
      }
    });

  await renderTemplate("cheatsheets/form.html", {markdown, form}, true);

  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/github_dark");
  editor.session.setMode("ace/mode/markdown");
}

export async function viewCheatsheetEdit() {
  const result = {}; // await getCheatsheetList();

}

export function viewCheatsheetDelete() {
  const result = {}; // await getCheatsheetList();
  return renderTemplate("cheatsheets/index.html", {result});
}

export function viewCheatsheetPreview() {
  return renderTemplate("cheatsheets/preview.html", {}, true);
}