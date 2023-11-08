import User from "../models/item.js";
export async function loadUsersFromDb() { }
export async function findUserInDb(login, pass) { }
export async function saveUsersToDb(users) { }
export async function registerUser(login, pass) {
    try {
        const newUser = new User({
            login,
            pass,
            todos: [],
        });
        const savedUser = await newUser.save();
        console.dir(`26 (mongoDB.dataController): ${savedUser}`);
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
export async function readNumberOfAllTasks() { }
//# sourceMappingURL=dataController.js.map