export function signInForm() {
  const form = document.getElementById("signin_form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payLoad = {
      username: e.target.username.value,
      password: e.target.password.value,
    }
    console.log(payLoad);
    const response = await authService.signIn(payLoad);
    console.log(response);
    // console.log(e.target.username.value);
    // console.log(e.target.password.value);
  });
}

export function signUpForm() {
  const form = document.getElementById("signup_form");

  // Listen for submits
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  });
}