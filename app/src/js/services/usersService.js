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

  static async createUser(formData) {
    // Make API-Call to create user

    // If user creation successful, return uuid

    // create dir in /output/
  }

  static async updateUser(formData) {
    // Make API-Call to update user
  }

  static async deleteUser(id) {
    // Make API-call to delete user (set status to inactive)
  }
}