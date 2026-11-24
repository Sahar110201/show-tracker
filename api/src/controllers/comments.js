import mongoose from "mongoose";
import { HttpError } from "../errors.js";
import { Comment } from "../models/Comment.js";
import { WatchlistItem } from "../models/WatchlistItem.js";
import { findByIdOr404 } from "../utils/findById.js";

// The fields of the watchlist item that get sent with a populated comment.
const linkedFields = "tvmazeId name status episodesWatched rating";

// Works out which watchlist item a comment belongs to.
// The form on the show page only knows the TVmaze id, so the matching watchlist
// item is looked up here. A show that is not on the watchlist has no item to
// link to, which is allowed, so the link is left empty.
async function findLinkedItem(data) {
  // An id sent by the caller wins. A bad id is a 404 and not a silent empty link.
  if (data.watchlistItem) {
    const item = await findByIdOr404(WatchlistItem, data.watchlistItem);
    return item._id;
  }

  // A tvmazeId that is not a whole number cannot match anything. The schema
  // reports it as a field error when the comment is saved.
  if (!Number.isInteger(data.tvmazeId)) {
    return null;
  }

  const item = await WatchlistItem.findOne({ tvmazeId: data.tvmazeId }).select("_id");

  if (!item) {
    return null;
  }

  return item._id;
}

// This lists all the comments, newest last so the show page can add to the bottom.
// ?tvmazeId= and ?watchlistItem= narrow the list down to one show or one item.
export async function listComments(req, res) {
  const filter = {};

  if (req.query.tvmazeId) {
    const tvmazeId = Number(req.query.tvmazeId);

    if (!Number.isInteger(tvmazeId) || tvmazeId < 1) {
      throw new HttpError(400, "Validation failed", {
        tvmazeId: "TVMaze ID must be a whole number",
      });
    }

    filter.tvmazeId = tvmazeId;
  }

  if (req.query.watchlistItem) {
    if (!mongoose.isValidObjectId(req.query.watchlistItem)) {
      throw new HttpError(400, "Validation failed", {
        watchlistItem: "Watchlist item id is not valid",
      });
    }

    filter.watchlistItem = req.query.watchlistItem;
  }

  const comments = await Comment.find(filter).sort("createdAt");

  res.status(200).json(comments);
}

// This gets 1 comment by its ID, together with the watchlist item it belongs to.
// populate() replaces the stored id with the whole item, so the page gets the
// comment and the show it is about from this one request.
export async function getComment(req, res) {
  const comment = await findByIdOr404(Comment, req.params.id, {
    path: "watchlistItem",
    select: linkedFields,
  });

  res.status(200).json(comment);
}

// This creates a new comment
export async function createComment(req, res) {
  const data = req.body ?? {};

  // The schema checks the data, so a bad body ends up as a 400 with field details.
  const comment = await Comment.create({
    tvmazeId: data.tvmazeId,
    text: data.text,
    watchlistItem: await findLinkedItem(data),
  });

  res.status(201).json(comment);
}

// This updates an existing comment. A PUT replaces the whole comment, so the
// link is worked out again from the body.
export async function updateComment(req, res) {
  const data = req.body ?? {};
  const comment = await findByIdOr404(Comment, req.params.id);

  comment.tvmazeId = data.tvmazeId;
  comment.text = data.text;
  comment.watchlistItem = await findLinkedItem(data);

  // save() runs the schema rules, so a bad change is a 400 and not a saved mess.
  await comment.save();

  res.status(200).json(comment);
}

// This deletes the comment
export async function deleteComment(req, res) {
  const comment = await findByIdOr404(Comment, req.params.id);

  await comment.deleteOne();

  // This returns a response with no content
  res.status(204).send();
}
