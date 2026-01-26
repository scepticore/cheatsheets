import {renderTemplate} from "../utils/templateEngine";
import {formGenerator} from "../utils/formBuilder";
import {usersService} from "../services/usersService";

export async function showUsers() {
  const users = await usersService.getUserList();
  return renderTemplate("users/list.html", {users})
}

export async function showUser(id) {
  const user = await usersService.getUser(id);
  return renderTemplate("users/detail.html", {user});
}

export async function formSignIn() {
  const form = new formGenerator("Sign In", {
      "callback": "window.usersService.signIn()"
    },
    {
      "username": {
        "type": "text",
        "attr": {
          "required": true
        }
      },
      "password": {
        "type": "password",
        "attr": {
          "required": true
        }
      },
      "rememberme": {
        "type": "checkbox"
      }
    }
  );

  return renderTemplate("users/signin.html", {form});
}

export async function formSignUp() {
  const form = new formGenerator("Sign Up", {
      "callback": "window.usersService.signUp()"
    },
    {
      "username": {
        "type": "text",
        "attr": {
          "required": true
        }
      },
      "email": {
        "type": "email",
        "attr": {
          "required": true
        }
      },
      "password": {
        "type": "password",
        "attr": {
          "required": true,
          "minlength": 8
        }
      },
      "password_confirmation": {
        "type": "password",
        "attr": {
          "required": true,
          "minlength": 8
        }
      }
    }
  );

  return renderTemplate("users/signup.html", {form});
}

export async function showUserForm(userId) {
  const user = userId ? await usersService.getUser(userId) : null;
  const title = user ? "Edit User" : "Create User";
  const form = new formGenerator(title,
    {
      "callback": "window.usersService.handleUserForm()"
    },
    {
      "firstname": {
        "type": "text",
        "attr": {
          "maxLength": 100,
          "required": false,
          "class": "first_class second_class",
          "value": user ? user.firstname : "",
        },
      },
      "name": {
        "type": "text",
        "attr": {
          "maxLength": 32,
          "required": true,
          "value": user ? user.lastname : "",
        },
      },
      "email": {
        "type": "email",
        "attr": {
          "required": false,
          "value": user ? user.email : "",
        }
      },
      "password": {
        "type": "password",
        "attr": {
          "minLength": 12,
          "required": true,
          "value": user ? user.password : "",
        }
      },
      "newsletter": {
        "type": "checkbox",
        "checked": user ? user.newsletter : true
      },
      "birthdate": {
        "type": "date",
        "attr": {
          "min": "1900-01-01",
          "max": new Date(Date.now()).toISOString().split("T")[0],
          "value": user ? user.birthdate : "",
        }
      },
      "gender": {
        "type": "select",
        "attr": {},
        "options": {
          "0": "female",
          "1": "male",
          "2": "nonbinary"
        },
        "selected": user ? user.gender : ""
      },
      "description": {
        "type": "textarea",
        "content": user ? user.description : "",
        "attr": {
          "maxLength": 100
        }
      }
    });

  return renderTemplate("users/form.html", {example: form});
}