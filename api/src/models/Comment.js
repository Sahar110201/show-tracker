import mongoose from "mongoose";
import { toJSONOptions } from "./to-json.js";

// Mongoose schema for a comment. Every comment belongs to one watchlist item.
const commentSchema = new mongoose.Schema(
  {
    // The watchlist item this comment was left on. "ref" names the other model,
    // which is what populate() needs to swap this id for the whole item.
    // A show that is not on the watchlist yet leaves this empty.
    watchlistItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WatchlistItem",
      default: null,
    },

    // The show's id on TVmaze. The show page only knows this number, so the
    // comment keeps it as well as the link to the watchlist item.
    tvmazeId: {
      type: Number,
      required: [true, "TVMaze ID is required"],
      min: [1, "TVMaze ID must be a positive number"],
      validate: {
        validator: Number.isInteger,
        message: "TVMaze ID must be a whole number",
      },
    },

    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [1, "Comment text cannot be empty"],
      maxlength: [500, "Comment cannot be longer than 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
  }
);

// The two ways the app looks comments up: by show and by watchlist item.
commentSchema.index({ tvmazeId: 1 });
commentSchema.index({ watchlistItem: 1 });

export const Comment = mongoose.model("Comment", commentSchema);
