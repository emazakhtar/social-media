// server/src/routes/auth.ts

import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const router = Router();

// ---------------------------------------------------------------------
// POST /api/auth/register
// This endpoint registers a new user.
// ---------------------------------------------------------------------
router.post("/register", async (req: Request, res: Response) => {
  // Extract required fields from the request body.
  console.log(req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    // If any field is missing, send a 400 error (bad request).
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if a user with the given email already exists.
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }

    // Generate a salt to help secure the password.
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt.
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document with the hashed password.
    const user = new User({ username, email, password: hashedPassword });
    await user.save(); // Save the new user to the database.

    // Respond with a success message.
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // If there is any error, send a 500 error (internal server error).
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------------------------------------------------------------
// POST /api/auth/login
// This endpoint logs in a user and returns a JWT token.
// ---------------------------------------------------------------------
router.post("/login", async (req: Request, res: Response) => {
  // Get email and password from request body.
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find the user in the database using the email.
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      // If the user does not exist, return an error.
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password in the database.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the passwords do not match, send an error.
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Create a JWT (JSON Web Token) using a secret key.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret", // In production, store the secret in an environment variable.
      { expiresIn: "1h" } // The token will expire in 1 hour.
    );

    // Send the token and some user info (excluding the password) back to the client.
    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
