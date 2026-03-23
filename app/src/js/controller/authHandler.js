/**
 * Handle Sign In Form Actions
 */
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
    if(response.error) {
      const errorMessageContainer = document.getElementById("error-message");
      const userName = document.getElementById("username");
      const password = document.getElementById("password");
      userName.classList.add("invalid");
      password.classList.add("invalid");
      errorMessageContainer.innerHTML = response.error;
      errorMessageContainer.classList.add("active");
    }
  });
}

/**
 * Handle SignUp Form Actions
 */
export function signUpForm() {
  const form = document.getElementById("signup_form");
  const submitButton = document.getElementById("signup_submit");

  checkInput(form, "username", submitButton);
  checkInput(form, "email", submitButton);
  checkPassword(form, submitButton);

  // Listen for submits
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payLoad = {
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
    }
    console.log(payLoad);
    const response = await authService.signUp(payLoad);
    console.log(response);
  });
}

function checkInput(form, input, submitButton) {
  const inputField = form.querySelector(`input[name="${input}"]`);
  let timer;
  inputField.addEventListener("input", async (e) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const inputFieldValue = e.target.value;
      if (inputFieldValue) {
        let valueExists;
        let errorText;
        switch (input) {
          case "username":
             valueExists = await usersService.getUserByUsername(inputFieldValue);
             errorText = "Username already exists";
             break;
           case "email":
             valueExists = await usersService.getUserByEmail(inputFieldValue);
             errorText = "Email already exists";
             break;
        }
        const errorInput = document.getElementById(`error_${input}`);
        if(valueExists) {
          inputField.classList.remove("success");
          inputField.classList.add("error");
          errorInput.innerHTML = errorText;
          submitButton.classList.add("disabled");
          submitButton.disabled = true;
        } else {
          inputField.classList.add("success");
          inputField.classList.remove("error");
          errorInput.innerHTML = null;
          submitButton.classList.remove("disabled");
          submitButton.disabled = false;
        }
      } else {
        inputField.classList.remove("success");
        inputField.classList.remove("error");
      }
    }, 500);
  })
}

function checkPassword(form, submitButton) {

  const password = document.getElementById("password");
  const passwordError = document.getElementById("error_password");

  const passwordConfirm = document.getElementById("password_confirm");
  const passwordConfirmError = document.getElementById("error_password_confirm");

  let timer;

  const updateSubmitButton = () => {
    const isValid = passwordError.textContent === "" &&
      passwordConfirmError.textContent === "" &&
      password.value.length > 0 &&
      passwordConfirm.value.length > 0;

    submitButton.disabled = !isValid;
  };

  password.addEventListener("input", async (e) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const val = password.value;
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._#-]{8,}$/;

      if(!regex.test(val)) {
        passwordError.textContent = "Must at least contain 8 characters, upper- and lowercase as well as symbols";
        password.classList.add("error");
        password.classList.remove("success");
      } else {
        passwordError.textContent = "";
        password.classList.add("success");
        password.classList.remove("error");
      }

      if (passwordConfirm.value.length > 0 ) {
        checkMatch();
      }
      updateSubmitButton();
    }, 500);
  });

  const checkMatch = () => {
    if (password.value !== passwordConfirm.value) {
      passwordConfirmError.textContent = "Passwords do not match";
      password.classList.add("error");
      passwordConfirm.classList.add("error");
      passwordConfirm.classList.remove("success");
      password.classList.remove("success");
    } else {
      passwordConfirmError.textContent = "";
      passwordConfirm.classList.add("success");
      passwordConfirm.classList.remove("error");
      password.classList.add("success");
      password.classList.remove("error");
    }
  }
  passwordConfirm.addEventListener("input", async (e) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      checkMatch();
      updateSubmitButton();
    }, 500)
  })
}