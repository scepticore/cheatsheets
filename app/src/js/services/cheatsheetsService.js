import {requestService} from "../utils/requests";
import {API_BASE} from "../constants.js";

export class cheatsheetsService {

  static async getCheatsheets() {
    // Run API-Call with current user id
    return requestService.fetchResponse(API_BASE+"cheatsheets?user_id=700a71fb-9f0e-4bf4-9f86-41c66ada062e", "cheatsheet", "GET", {}, {});
  }

  static async getCheatsheetById(id) {
    // Run API-Call
    const cheatsheet = await requestService.fetchResponse(API_BASE+"cheatsheet/"+id, "cheatsheet", "GET", {}, {});
    const markdown = await requestService.fetchResponse(API_BASE+"cheatsheet/"+id+"/markdown", "cheatsheet", "GET", {}, {});
    return {cheatsheet: cheatsheet.data, markdown: markdown.data};
  }

  static async getCheatsheetMarkdown(id) {
    const result = await requestService.fetchResponse(API_BASE+"cheatsheet/"+id+"/markdown", "cheatsheet", "GET", {}, {});
    console.log(result);
    return result.data;
  }

  static async createCheatsheet() {

  }

  static async getCheatSheetMD() {
    // Run API-Call
  }

  static async updateCheatsheet(uuid) {
    // Run API-Call
  }

  static async deleteCheatsheet(uuid) {
    // Run API-Call
  }
}