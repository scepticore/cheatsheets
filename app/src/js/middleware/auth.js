export function isAdmin() {
  // @todo get token
  // const token = window.sessionStorage.getItem("token");

  // @todo also verify role with token!
  if (window.sessionStorage.getItem("role") === "admin" ) {

  }
}

export function isLoggedIn() {
  if (window.sessionStorage.getItem("token")) {
    return true;
  } else {
    window.location.href = "/signin";
  }
}