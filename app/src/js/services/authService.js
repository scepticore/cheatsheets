import {usersService} from "./usersService.js";
import {requestService} from "../utils/requests.js";
import {API_BASE, HOST} from "../constants.js";

export class authService {
  static async signIn(formData) {
    const body = JSON.stringify({
      username: formData.username,
      password: encodeURI(formData.password)
    });
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorBody = await response.json();;
      return errorBody;
    }

    const data = await response.json();
    // @todo add autologin
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("refreshToken", data.refreshToken);
    sessionStorage.setItem("username", data.username);
    sessionStorage.setItem("userId", data.userId);
    sessionStorage.setItem("role", data.role);

    window.location.href = "/cheatsheets";
  }

  static async signUp(formData) {
    // If success, create new User
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }
    console.log(userData);

    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log(response);

    if(response.ok && response.status === 201 ) {
      window.location.href = `${HOST}/signin?message=Successfully%20registered%20-%20You%20may%20now%20sign%20in`;
    }
    const data = await response.json();
  }

  static signOut() {
    sessionStorage.clear();
    window.location.href = `${HOST}/signin`;
  }

  static async isAdmin(userId) {
    const response = await requestService.fetch(`${API_BASE}/user/${userId}/role`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    return response[0].role === "admin";
  }
}

window.authService = authService;