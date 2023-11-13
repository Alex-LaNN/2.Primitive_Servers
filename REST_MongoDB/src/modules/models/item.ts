import mongoose, { Schema } from "mongoose";

/**
 * Mongoose schema creation module for 'User' and its 'Todo' tasks.
 */

// Defining an interface for 'User' that contains an array of 'Todo' tasks.
interface User {
  _id: mongoose.Types.ObjectId;
  login: string;
  pass: string;
  todos: Todo[];
}

// Defining the interface for the 'Todo' task.
interface Todo {
  _id: mongoose.Types.ObjectId;
  text: string;
  checked: boolean;
}
// Creating a schema for the 'Todo' task.
const todoSchema = new Schema<Todo>({
  _id: Schema.Types.ObjectId,
  text: String,
  checked: Boolean,
});
// Creating a schema for 'User' with an array of 'Todo' tasks.
const userSchema = new Schema<User>({
  _id: mongoose.Types.ObjectId,
  login: String,
  pass: String,
  todos: [todoSchema],
});

// Export of created models.
export const models = {
  User: mongoose.model<User>("User", userSchema),
  Todo: mongoose.model<Todo>("Todo", todoSchema),
};
