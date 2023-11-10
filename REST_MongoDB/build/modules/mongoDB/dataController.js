import mongoose from "mongoose";
import { models } from "../models/item.js";
const { User } = models;
export async function registerUser(login, pass) {
    try {
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            login,
            pass,
            todos: [],
        });
        const savedUser = await newUser.save();
        return savedUser;
    }
    catch (error) {
        throw new Error(`Failed to register user: ${error}`);
    }
}
export async function loadItemsFromDb(user) {
    try {
        const foundUser = await User.findById(user._id);
        if (!foundUser) {
            throw new Error("User not found");
        }
        return foundUser.todos;
    }
    catch (error) {
        throw new Error(`Failed to load items from the database: ${error}`);
    }
}
//# sourceMappingURL=dataController.js.map