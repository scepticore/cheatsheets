import {isLoggedIn} from "../middleware/auth.js";

export function getUserName() {
  const username = sessionStorage.getItem("username");
  if(username){
    const usernameField = document.getElementById("username");
    usernameField.innerHTML = `${username} | <a href="/signout">Logout</a>`;
  }
}