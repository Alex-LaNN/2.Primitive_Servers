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
export default mongoose.model("User", userSchema);
//# sourceMappingURL=item.js.map