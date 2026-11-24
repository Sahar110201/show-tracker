import mongoose from "mongoose";
import { HttpError } from "../errors.js";

// This finds one document by its id from the address or throws a 404. An ID that us badly formed can never match, so we answer 404 without asking the database.
// Pass "populate" to also load a linked document, for example "watchlistItem".
export async function findByIdOr404(Model, id, populate = null) {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(404, `${Model.modelName} not found`);
  }

  const query = Model.findById(id);

  if (populate) {
    query.populate(populate);
  }

  const doc = await query;

  if (!doc) {
    throw new HttpError(404, `${Model.modelName} not found`);
  }

  return doc;
}
