import { Router, Request, Response } from "express";
import User from "../models/User";
import { protect } from "../middlewares/authMiddleware"; // Import middleware

const router = Router();

router.get("/", protect, async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search && typeof search === "string") {
      filter = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    const users = await User.find(filter).select("username email");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
