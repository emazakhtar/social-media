import { Router, Request, Response } from "express";
import User from "../models/User";
import { protect } from "../middlewares/authMiddleware"; // Import middleware

const router = Router();

router.get("/:userId", protect, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "username email"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/add", protect, async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;
  if (!userId || !friendId) {
    return res
      .status(400)
      .json({ message: "userId and friendId are required." });
  }
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: "One or both users not found." });
    }
    if (user.friends && user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Users are already friends." });
    }
    user.friends = user.friends ? [...user.friends, friend._id] : [friend._id];
    friend.friends = friend.friends
      ? [...friend.friends, user._id]
      : [user._id];
    await user.save();
    await friend.save();
    res.status(200).json({ message: "Friend added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
