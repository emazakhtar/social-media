import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
