import {isLoggedIn} from "../middleware/auth.js";

export function getUserName() {
  const username = sessionStorage.getItem("username");
  if(username){
    const usernameField = document.getElementById("user_button");
    usernameField.innerHTML = `<span id="username"><i class="bi bi-person-fill"></i>${username}</span>`;

    const mainNav = document.getElementById("main_nav").children[0];
    mainNav.insertAdjacentHTML('afterbegin', `<li><a href="/dashboard" title="Dashboard"><i class="bi bi-house-door-fill"></i> Dashboard</a></li>`);
    mainNav.innerHTML += `<li><a href="/signout"><i class="bi bi-box-arrow-right"></i> Logout</a></li>`
  }
}

export function getUserRole() {
  const userRole = sessionStorage.getItem("role");
  if(userRole === "admin" ) {
    const mainNav = document.getElementById("main_nav").children[0];
    mainNav.innerHTML += `<li><a href="/admin"><i class="bi bi-wrench"></i> Admin</a></li>`
  }
}