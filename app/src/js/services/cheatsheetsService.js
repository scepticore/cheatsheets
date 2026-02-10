import {requestService} from "../utils/requests";
import {API_BASE} from "../constants.js";

export class cheatsheetsService {

  /**
   * Get list of own cheatsheets by user ID
   * @returns {Promise<Object>}
   */
  static async getCheatsheets() {
    // Run API-Call with current user id
    return requestService.fetchResponse(API_BASE+"cheatsheets?user_id=700a71fb-9f0e-4bf4-9f86-41c66ada062e", "cheatsheet", "GET", null, null);
  }

  /**
   * Get cheatsheet by UUID from API
   * @param id
   * @returns {Promise<{cheatsheet: *, markdown: *}>}
   */
  static async getCheatsheetById(id) {
    // Run API-Call
    const cheatsheet = await requestService.fetchResponse(API_BASE+"cheatsheet/"+id, "cheatsheet", "GET", null, null);
    const markdown = await requestService.fetchResponse(API_BASE+"cheatsheet/"+id+"/markdown", "cheatsheet", "GET", null, null);
    return {cheatsheet: cheatsheet.data, markdown: markdown.data};
  }

  /**
   * Get markdown for cheatsheet from API
   * @param id
   * @returns {Promise<*>}
   */
  static async getCheatsheetMarkdown(id) {
    const result = await requestService.fetchResponse(API_BASE+"cheatsheet/"+id+"/markdown", "cheatsheet", "GET", null, null);
    console.log(result);
    return result.data;
  }

  /**
   * Create new Cheatsheet by calling API
   * @returns {Promise<void>}
   */
  static async createCheatsheet() {
    const result = await requestService.fetchResponse(API_BASE+"cheatsheets/create", "cheatsheets", "POST", null, null);
    if( result.status === 200) {
      const uuid = result.data.result[0].uuid;
      window.location.href = `/cheatsheets/${uuid}/edit`;
    } else {
      // Error message?
    }
  }

  /**
   * Update Cheatsheet (SQLite)
   * @param uuid
   * @param value
   * @returns {Promise<void>}
   */
  static async updateCheatsheet(uuid, value) {
    const newValue = JSON.parse(value);
    const result = await requestService.fetchResponse(API_BASE+"cheatsheet/"+uuid+"/update", "cheatsheet", "PUT", null, newValue);
    return result.data;
  }

  /**
   * Update Markdown (MongoDB)
   * @param uuid
   * @param value
   * @returns {Promise<void>}
   */
  static async updateCheatsheetMarkdown(uuid, value) {
    const newValue = JSON.parse(value);
    const result = await requestService.fetchResponse(API_BASE+"cheatsheet/"+uuid+"/markdown/update", "cheatsheet", "PUT", null, newValue);
    return result.data;
  }

  /**
   * Delete cheatsheet by UUID by setting state to inactive (moving to bin)
   * @param uuid
   * @returns {Promise<void>}
   */
  static async deleteCheatsheet(uuid) {
    // Run API-Call
  }
}