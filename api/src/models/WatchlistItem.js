import mongoose from "mongoose";
import { toJSONOptions } from "./to-json.js";

const allowedStatuses = [ "plan_to_watch", "watching", "finished", "dropped",];
const watchlistItemSchema = new mongoose.Schema(
  {
    tvmazeId: {
      type: Number,
      required: [true, "TVMaze ID is required"],
      min: [1, "TVMaze ID must be a positive number"],
      validate: {
        validator: Number.isInteger,
        message: "TVMaze ID must be a whole number",
      },
    },

    name: {
      type: String,
      required: [true, "Show name is required"],
      trim: true,
      minlength: [1, "Show name cannot be empty"],
      maxlength: [150, "Show name cannot be longer than 150 characters"],
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: allowedStatuses,
        message: "Status is not valid",
      },
    },

    episodesWatched: {
      type: Number,
      required: [true, "Episodes watched is required"],
      min: [0, "Episodes watched cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Episodes watched must be a whole number",
      },
    },

    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
  }
);

export const WatchlistItem = mongoose.model(
  "WatchlistItem",
  watchlistItemSchema
);