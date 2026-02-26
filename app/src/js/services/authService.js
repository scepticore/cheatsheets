import {usersService} from "./usersService.js";
import {requestService} from "../utils/requests.js";
import {API_BASE} from "../constants.js";

export class authService {
  static async signIn(formData) {
    const body = JSON.stringify(formData);
    console.log(body);
    const response = await fetch(API_BASE+"auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Login failed");
      return;
    }

    const data = await response.json();
    // @todo add autologin
    window.sessionStorage.setItem("token", data.token);
    window.sessionStorage.setItem("refreshToken", data.refreshToken);
    window.sessionStorage.setItem("username", data.username);
    window.sessionStorage.setItem("userId", data.userId);
    window.sessionStorage.setItem("role", data.role);

    window.location.href = "/cheatsheets";
  }

  static async signUp(formData) {
    console.log(formData);
    let error = null;

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
    const response = await fetch(API_BASE + "auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    console.log(response);

    const data = await response.json();
    console.log(data);

  }

  static signOut() {
    sessionStorage.clear();
    window.location.href = "/signin";
  }
}

window.authService = authService;