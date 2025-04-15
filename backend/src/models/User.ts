// server/src/models/User.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  friends?: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true }, // The user's name. It must be provided.
    email: { type: String, required: true, unique: true }, // Email must be unique.
    password: { type: String, required: true }, // Password is required and will be stored securely.
    // Add a friends field to store references to friend User documents.
    friends: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
  },
  { timestamps: true } // Automatically keeps track of when a user is created or updated.
);

export default mongoose.model<IUser>("User", UserSchema);
