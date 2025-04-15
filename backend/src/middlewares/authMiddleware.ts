// server/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define an interface for the payload we expect to receive after decoding the JWT.
interface JwtPayload {
  userId: string;
}

// This middleware function verifies the JWT token.
export const protect = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the token from the Authorization header.
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  // Extract token from the header by splitting at space.
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret (the secret should be stored securely in .env)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;

    // Attach the decoded payload to the request object, so later middleware/routes can access it.
    // We typically add a "user" property to hold user info.
    // req.user = { id: decoded.userId };

    // If the token is valid, continue to the next middleware.
    next();
  } catch (error) {
    // If token verification fails, send an unauthorized error.
    return res.status(401).json({ message: "Token is not valid" });
  }
};
