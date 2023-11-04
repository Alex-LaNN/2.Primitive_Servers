import mongoose from "mongoose";
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    login: String,
    password: String,
    todos: [
        {
            _id: mongoose.Types.ObjectId,
            text: String,
            checked: Boolean,
        },
    ],
});
export const Item = mongoose.model("item", taskSchema);
//# sourceMappingURL=item.js.map