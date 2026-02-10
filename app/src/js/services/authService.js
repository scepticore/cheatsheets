import {usersService} from "./usersService.js";
import {requestService} from "../utils/requests.js";
import {API_BASE} from "../constants.js";

export class authService {
  static async signIn(formData) {
    // Encrypt password
    const password = formData.password;
    const username = formData.username;

    // Send login request to API
    // Body: { "username": username, "password": password }
    // const result = await requestService.fetchResponse(API_BASE+"/signin");
  }

  static async signUp(formData) {
    console.log(formData);
    let error = {};

    // check if username already exists
    const usernameResult = await usersService.getUserByUsername(formData.username);
    if (usernameResult && usernameResult.length > 0) {
      error += {"username": "Username already taken."}
    }

    // check if email already exists
    const emailResult = await usersService.getUserByEmail(formData.email);
    if (emailResult && emailResult.length > 0) {
      error += {"email": "Email already taken."}
    }

    // Compare password and password_confirmation
    if (formData.password !== formData.password_confirmation) {
      // @todo create a proper error message to render in template
      error += {"password": "Password already taken."}
    }

    // If any error exists, return them
    if (error) {
      console.log(error);
      return error;
    }

    // If success, create new User
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }

    console.log(userData);
    const result = await requestService.fetchResponse(API_BASE + "users/create", "user", "POST", null, userData)
    // Send data to API
    console.log(result);
    //
  }
}

window.authService = authService;