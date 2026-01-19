import {renderTemplate} from "../utils/templateEngine";
import {formGenerator} from "../utils/formBuilder";
import {cheatsheetsService} from "../services/cheatsheetsService";

export async function viewCheatsheetList() {
  const result = {};
  const cheatsheets = await cheatsheetsService.getCheatsheets();

  console.log(cheatsheets);
  return renderTemplate("cheatsheets/index.html", {cheatsheets});
}

export function viewCheatsheetDetail(id) {
  const result = {}; // await getCheatsheetList();
  result.id = id;
  return renderTemplate("cheatsheets/detail.html", {result});
}

export function viewCheatsheetCreate() {
  const result = {}; // await getCheatsheetList();
  // const title = params.id ? "Edit cheatsheet": "Create new cheatsheet";
  const form = new formGenerator(null,
    {
      "callback": "window.usersService.handleUserForm()" // edit this
    },
    {
      "title": {
        "type": "text",
        "attr": {
          "maxLength": 100,
          "required": false,
          "class": "first_class second_class",
          "value": ""
        },
      },
      "description": {
        "type": "textarea",
        "content": "",
        "attr": {
          "maxLength": 500
        }
      }
    });


  return renderTemplate("cheatsheets/create.html", {result, form});
}

export function viewCheatsheetEdit() {
  const result = {}; // await getCheatsheetList();
  return renderTemplate("cheatsheets/index.html", {result});
}

export function viewCheatsheetDelete() {
  const result = {}; // await getCheatsheetList();
  return renderTemplate("cheatsheets/index.html", {result});
}