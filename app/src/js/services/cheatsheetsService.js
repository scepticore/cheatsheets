import {requestService} from "../utils/requests";
import {API_BASE} from "../constants.js";

export class cheatsheetsService {

  /**
   * Get list of own cheatsheets by user ID
   * @returns {Promise<Object>}
   */
  static async getCheatsheets() {
    // Run API-Call with current user id
    const userId = window.sessionStorage.getItem('userId');

    return requestService.fetch(API_BASE+"/cheatsheets?user_id="+userId, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    });
  }

  /**
   * Get latest cheatsheets by user
   * @returns {Promise<*>}
   */
  static async getLatestCheatsheets() {
    const userId = window.sessionStorage.getItem('userId');
    return requestService.fetch(API_BASE+"/cheatsheets/latest?user_id="+userId, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    });
  }

  static async getDeletedCheatsheets() {
    const userId = window.sessionStorage.getItem('userId');
    return requestService.fetch(API_BASE+"/cheatsheets/bin?user_id="+userId, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    })
  }

  static async getBinSize() {
    const userId = window.sessionStorage.getItem('userId');
    return requestService.fetch(API_BASE+"/cheatsheets/bin/size?user_id="+userId, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    })
  }

  /**
   * Get public cheatsheets
   * @returns {Promise<*>}
   */
  static async getPublicCheatsheets(limit = null) {
    return requestService.fetch(API_BASE+"/cheatsheets/public?limit="+limit, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    });
  }

  /**
   * Get cheatsheet by UUID from API
   * @param id
   * @returns {Promise<{cheatsheet: *, markdown: *}>}
   */
  static async getCheatsheetById(id) {
    const cheatsheet = await requestService.fetch(API_BASE+"/cheatsheet/"+id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    // @todo make use of getCheatsheetMarkdown
    const markdown = await requestService.fetch(API_BASE+"/cheatsheet/"+id+"/markdown", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return {cheatsheet: cheatsheet, markdown: markdown};
  }

  /**
   * Get markdown for cheatsheet from API
   * @param id
   * @returns {Promise<*>}
   */
  static async getCheatsheetMarkdown(id) {
    const result = await requestService.fetch(API_BASE+"/cheatsheet/"+id+"/markdown", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return result;
  }

  /**
   * Create new Cheatsheet by calling API
   * @returns {Promise<void>}
   */
  static async createCheatsheet(userId) {
    const body = {'userId': userId};
    const result = await requestService.fetch(API_BASE+"/cheatsheets/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const uuid = result[0]?.uuid ? result[0].uuid : null;
    window.location.href = `/cheatsheets/${uuid}/edit`;
  }

  /**
   * Update Cheatsheet (SQLite)
   * @param uuid {uuid}
   * @param value {object}
   * @returns {Promise<void>}
   */
  static async updateCheatsheet(uuid, value) {
    const token = sessionStorage.getItem("token");
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify(value),
    }

    const result = await fetch(API_BASE+"/cheatsheet/"+uuid+"/update", options);
    if (!result.ok) {
      console.error("Update failed");
    }
    if(result.status === 401) {
      const refreshToken = sessionStorage.getItem('refreshToken');

      const refreshRes = await fetch(API_BASE+"/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({refreshToken}),
      })

      if (refreshRes.ok) {
        const { token } = await refreshRes.json();
        sessionStorage.setItem('token', token);
        options.headers["Authorization"] = "Bearer " + token;
        return fetch(API_BASE+"/cheatsheet/"+uuid+"/update", options);
      } else {
        window.router.navigate("/login");
      }
    }
  }

  /**
   * Update Markdown (MongoDB)
   * @param uuid
   * @param value
   * @returns {Promise<void>}
   */
  static async updateCheatsheetMarkdown(uuid, value) {
    const newValue = JSON.parse(value);
    const result = await fetch(API_BASE+"/cheatsheet/"+uuid+"/markdown/update", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${window.sessionStorage.getItem('token')}`
      },
      body: JSON.stringify(newValue),
    });
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

  static async downloadPdf(uuid) {
    const pdf = await requestService.fetch(API_BASE+"/generate-pdf/"+uuid, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${window.sessionStorage.getItem('token')}`
      }
    });
    return pdf;
  }
}