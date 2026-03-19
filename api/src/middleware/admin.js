import {getUserRoleById} from "../services/users.js";

export async function isAdmin(req, res, next) {
  const userRole = await getUserRoleById(req.query.user_id);
  console.log(`userRole: ${userRole}`);
  console.log(userRole[0].role);
  if (userRole[0].role === "admin") {
    return true;
  }
  return false;
}