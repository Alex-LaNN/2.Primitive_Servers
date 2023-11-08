import mongoose, { Schema } from "mongoose";

interface User {
  _id: mongoose.Types.ObjectId;
  login: string;
  pass: string;
  todos: Todo[];
}

interface Todo {
  _id: mongoose.Types.ObjectId;
  text: string;
  checked: boolean;
}

const todoSchema = new Schema<Todo>({
  _id: Schema.Types.ObjectId,
  text: String,
  checked: Boolean,
});

const userSchema = new Schema<User>({
  _id: mongoose.Types.ObjectId,
  login: String,
  pass: String,
  todos: [todoSchema],
});

export default mongoose.model<User>("User", userSchema);
