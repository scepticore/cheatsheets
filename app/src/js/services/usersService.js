import { requestService } from "./requestService"

export class usersService {
  async getUserList() {
    return [
      {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe",
        "birthdate": "1990-01-01",
        "profession": "Medical IT Engineer"
      },
      {
        "id": 2,
        "firstname": "Jane",
        "lastname": "Doe",
        "birthdate": "1990-01-01",
        "profession": "Medical IT Software Developer"
      }
    ]
  }

  static async getUser(id) {
    return {
      "id": 1,
      "firstname": "John",
      "lastname": "Doe",
      "birthdate": "1990-01-01",
      "profession": "Medical IT Engineer",
      "email": "admin@example.com",
      "gender": 1,
      "description": "Just another IT guy",
      "newsletter": false,
    }
  }

  static async handleUserForm(formData) {
    console.log(formData);
  }
}