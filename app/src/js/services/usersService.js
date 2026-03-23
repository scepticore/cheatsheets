import {requestService} from "../utils/requests";
import {API_BASE} from "../constants.js";

export class usersService {
  /**
   * Get User List from SQlite DB
   * @returns {Promise<[{id: number, firstname: string, lastname: string, birthdate: string, profession: string},{id: number, firstname: string, lastname: string, birthdate: string, profession: string}]>}
   */
  static async getUserList() {
    try {
      const response = await requestService.fetch(`${API_BASE}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      return response;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Get User by UserID
   * @param id
   * @returns {Promise<{id: number, firstname: string, lastname: string, birthdate: string, profession: string, email: string, gender: number, description: string, newsletter: boolean}>}
   */
  static async getUser(id) {
    //
  }

  /**
   * Update User Information
   * @param formData
   * @returns {Promise<void>}
   */
  static async updateUser(formData) {
    // Make API-Call to update user
  }

  /**
   * Delete user account
   * @param id
   * @returns {Promise<void>}
   */
  static async deleteUser(id) {
    // Make API-call to delete user (set status to inactive)
  }

  /**
   * Get user by username
   * @param username
   * @returns {Promise<boolean>}
   */
  static async getUserByUsername(username) {
    return requestService.fetch(`${API_BASE}/username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"username": username})
    });
  }

  /**
   * Get user by email
   * @param email
   * @returns {Promise<boolean>}
   */
  static async getUserByEmail(email) {
    return requestService.fetch(`${API_BASE}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"email": email})
    });
  }
}

window.usersService = usersService;