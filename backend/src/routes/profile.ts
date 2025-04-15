// server/src/routes/profile.ts

import { Router, Request, Response } from "express";
import User from "../models/User";
import { protect } from "../middlewares/authMiddleware"; // Import the middleware

const router = Router();

// The profile route is now protected.
router.get("/:userId", protect, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Here, req.user is available because of the middleware.
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
