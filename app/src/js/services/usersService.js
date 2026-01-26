import {requestService} from "../utils/requests";
import {API_BASE} from "../constants.js";

export class usersService {
  async getUserList() {
    return [
      {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe",
        "birthdate": "1990-01-01",
        "profession": "Medical IT Engineer"
      },
      {
        "id": 2,
        "firstname": "Jane",
        "lastname": "Doe",
        "birthdate": "1990-01-01",
        "profession": "Medical IT Software Developer"
      }
    ]
  }

  static async getUser(id) {
    return {
      "id": 1,
      "firstname": "John",
      "lastname": "Doe",
      "birthdate": "1990-01-01",
      "profession": "Medical IT Engineer",
      "email": "admin@example.com",
      "gender": 1,
      "description": "Just another IT guy",
      "newsletter": false,
    }
  }

  static async handleUserForm(formData) {
    console.log(formData);
  }

  static async updateUser(formData) {
    // Make API-Call to update user
  }

  static async deleteUser(id) {
    // Make API-call to delete user (set status to inactive)
  }

  static async getUserByUsername(username) {
    return true;
  }

  static async getUserByEmail(email) {
    return true;
  }

  // @todo move to authService.js
  static async signIn(formData) {
    console.log(formData);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(formData.password));
    const passwordHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join('');
    // Send login request to API
  }

  // @todo move to authService.js
  static async signUp(formData) {
    console.log(formData);
    let error = {};

    // check if username already exists
    const usernameResult = await this.getUserByUsername(formData.username);
    if(usernameResult && usernameResult.length > 0) {
      error += {"username": "Username already taken."}
    }

    // check if email already exists
    const emailResult = await this.getUserByEmail(formData.email);
    if(emailResult && emailResult.length > 0) {
      error += {"email": "Email already taken."}
    }

    // Compare password and password_confirmation
    if(formData.password !== formData.password_confirmation) {
      // @todo create a proper error message to render in template
      error += {"password": "Password already taken."}
    }

    // If any error exists, return them
    if(error) {
      console.log(error);
      return error;
    }


    // If success, create new User

    // Encrypt password (SHA256)
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(formData.password));
    const passwordHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join('');

    const userData = {
      username: formData.username,
      email: formData.email,
      password: passwordHash,
    }

    console.log(userData);
    const result = await requestService.fetchResponse(API_BASE+"users/create", "user", "POST", null, userData)
    // Send data to API
    console.log(result);
    //
  }
}

window.usersService = usersService;