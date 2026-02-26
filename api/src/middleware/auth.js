import { jwtVerify } from "jose";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    console.error("Token missing");
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token"});
  }
}