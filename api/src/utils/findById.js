import mongoose from "mongoose";
import { HttpError } from "../errors.js";

// This finds one document by its id from the address or throws a 404. An ID that us badly formed can never match, so we answer 404 without asking the database.
export async function findByIdOr404(Model, id) {
  const doc = mongoose.isValidObjectId(id) ? await Model.findById(id) : null;

  if (!doc) {
    throw new HttpError(404, `${Model.modelName} not found`);
  }

  return doc;
}