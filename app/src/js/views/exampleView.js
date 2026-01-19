import {usersService} from "../services/usersService";
import {formGenerator} from "../../orchid/src/formBuilder";
import {renderTemplate} from "../../orchid/src/templateEngine";

export async function showExample() {
  const users = await usersService.getUserList();
  const user = await usersService.getUser(1);
  const form = new formGenerator("Example Form",
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

  return renderTemplate("example.html", { form, users });
}