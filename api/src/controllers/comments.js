import { z } from "zod";
import { HttpError } from "../errors.js";
import { validate } from "../validate.js";

const commentSchema = z.object({
  tvmazeId: z.number().int().positive(),
  text: z.string().min(1),
});

const comments = [
  { id: crypto.randomUUID(), tvmazeId: 169, text: "Great first episode, cannot wait for the rest!" },
  { id: crypto.randomUUID(), tvmazeId: 169, text: "Cannot wait for the next one, I am so excited." },
  { id: crypto.randomUUID(), tvmazeId: 82, text: "Rewatching this one for the 10th time!." },
];

function findIndexById(id) {
  const index = comments.findIndex((c) => c.id === id);
  if (index === -1) throw new HttpError(404, "Comment is not found");
  return index;
}

export function listComments(req, res) {
  res.status(200).json(comments);
}

export function getComment(req, res) {
  const index = findIndexById(req.params.id);
  res.status(200).json(comments[index]);
}

export function createComment(req, res) {
  const data = validate(commentSchema, req.body);
  const comment = { id: crypto.randomUUID(), ...data };
  comments.push(comment);
  res.status(201).json(comment);
}

export function updateComment(req, res) {
  const index = findIndexById(req.params.id);
  const data = validate(commentSchema, req.body);
  comments[index] = { id: comments[index].id, ...data };
  res.status(200).json(comments[index]);
}

export function deleteComment(req, res) {
  const index = findIndexById(req.params.id);
  comments.splice(index, 1);
  res.status(204).send();
}