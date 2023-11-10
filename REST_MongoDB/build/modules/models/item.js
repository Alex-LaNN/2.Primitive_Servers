import mongoose, { Schema } from "mongoose";
const todoSchema = new Schema({
    _id: Schema.Types.ObjectId,
    text: String,
    checked: Boolean,
});
const userSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    login: String,
    pass: String,
    todos: [todoSchema],
});
export const models = {
    User: mongoose.model("User", userSchema),
    Todo: mongoose.model("Todo", todoSchema),
};
//# sourceMappingURL=item.js.map