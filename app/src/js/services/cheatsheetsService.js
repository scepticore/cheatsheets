import {requestService} from "../utils/requests";
const API_BASE = import.meta.env.VITE_API_URL;

export class cheatsheetsService {

  static async getCheatsheets() {
    // Run API-Call with current user id
    // console.log("Getting cheatsheets...");
    return requestService.fetchResponse(API_BASE+"cheatsheets?user_id="+1, "cheatsheet", "GET", {}, {});
  }

  static async getCheatsheetById(id) {
    // Run API-Call
    const result = await requestService.fetchResponse(API_BASE+"cheatsheet/"+id, "cheatsheet", "GET", {}, {});
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