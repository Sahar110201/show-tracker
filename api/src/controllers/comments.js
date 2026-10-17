import { z } from "zod";
import { HttpError } from "../errors.js";
import { validate } from "../validate.js";

// This checks if the comment data is valid
const commentSchema = z.object({
  tvmazeId: z.number().int().positive(),
  text: z.string().min(1),
});

// This is storing comments in an array
const comments = [
  { id: crypto.randomUUID(), tvmazeId: 169, text: "Great first episode, cannot wait for the rest!" },
  { id: crypto.randomUUID(), tvmazeId: 169, text: "Cannot wait for the next one, I am so excited." },
  { id: crypto.randomUUID(), tvmazeId: 82, text: "Rewatching this one for the 10th time!" },
];

// This helps find a comment by its ID
function findIndexById(id) {
  const index = comments.findIndex((c) => c.id === id);

  // This returns an error if the comment does not exist
  if (index === -1) throw new HttpError(404, "Comment is not found");
  return index;
}

// This lists all the comments
export function listComments(req, res) {
  res.status(200).json(comments);
}

// This gets 1 comment by its ID
export function getComment(req, res) {
  const index = findIndexById(req.params.id);
  res.status(200).json(comments[index]);
}

// This creates a new comment
export function createComment(req, res) {
    // This checks if the submitted data is valid
  const data = validate(commentSchema, req.body);

  // This gives the comment a unique ID
  const comment = { id: crypto.randomUUID(), ...data };

  // This saves the new comment that has been added
  comments.push(comment);

  // This returns the new comment
  res.status(201).json(comment);
}

// This updates an existing comment
export function updateComment(req, res) {
  const index = findIndexById(req.params.id);

  // This checks if the new data is valid
  const data = validate(commentSchema, req.body);

  // This updates the comment while also retaining its ID
  comments[index] = { id: comments[index].id, ...data };

  // This returns the updated comment
  res.status(200).json(comments[index]);
}

// This deletes the comment
export function deleteComment(req, res) {
  const index = findIndexById(req.params.id);

  // This removes the comment from the array
  comments.splice(index, 1);

  // This returns a response with no content
  res.status(204).send();
}