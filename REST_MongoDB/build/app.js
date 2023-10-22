import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as taskController from "./modules/taskController.js";
import * as userController from "./modules/userController.js";
import sessionConfig from "./modules/sessionConfig.js";
const appFilePath = fileURLToPath(import.meta.url);
console.log(`appFilePath: ${appFilePath}`);
const buildPath = path.dirname(appFilePath);
console.log(`buildPath: ${buildPath}`);
const mainPath = path.dirname(buildPath);
const dbUtilsFileParts = path.dirname(buildPath) + "/src/modules/dbUtils";
console.log(`mainPath: ${mainPath}`);
const numberOfAllTasksFilePath = mainPath + "/src/modules/dbUtils/numberOfAllTasks.json";
const app = express();
app.use(express.json());
const port = process.env.PORT || 3005;
app.use(session(sessionConfig));
app.use("/client", (req, res) => {
    res.sendFile(path.resolve(mainPath, "./client/index.html"));
});
app.use(bodyParser.json());
app.get("/api/v1/items", taskController.getItems);
app.post("/api/v1/items", taskController.createItem);
app.put("/api/v1/items", taskController.updateItem);
app.delete("/api/v1/items", taskController.deleteItem);
app.post("/api/v1/login", userController.login);
app.post("/api/v1/logout", userController.logout);
app.post("/api/v1/register", userController.register);
export async function loadUsersFromDb() {
    const dbUsersFilePath = path.resolve(dbUtilsFileParts, "./dbUsers.json");
    console.log(`74 dbUsersFilePath: ${dbUsersFilePath}`);
    try {
        const dbData = await fs.promises.readFile(dbUsersFilePath, "utf-8");
        return JSON.parse(dbData);
    }
    catch (error) {
        return [];
    }
}
export async function findUserInDb(login, pass) {
    try {
        const users = await loadUsersFromDb();
        return users.find((user) => user.login === login && user.pass === pass);
    }
    catch (error) {
        console.error("Error while reading users from the database:", error);
        return null;
    }
}
export async function saveUsersToDb(users) {
    const data = JSON.stringify(users, null, 2);
    await fs.promises.writeFile("dbUsers.json", data, "utf8");
}
export async function registerUser(login, pass) {
    const users = await loadUsersFromDb();
    users.push({ login, pass });
    await saveUsersToDb(users);
}
export async function loadItemsFromDb() {
    const dbItemsFilePath = path.resolve(dbUtilsFileParts, "./dbItems.json");
    console.log(`116 dbItemsFilePath: ${dbItemsFilePath}`);
    try {
        const dbData = await fs.promises.readFile(dbItemsFilePath, "utf-8");
        return JSON.parse(dbData);
    }
    catch (error) {
        return {};
    }
}
export async function saveItemsToDb(items) {
    const dbItemsFilePath = path.resolve(dbUtilsFileParts, "./dbItems.json");
    console.log(`130 dbItemsFilePath: ${dbItemsFilePath}`);
    const data = JSON.stringify(items, null, 2);
    await fs.promises.writeFile(dbItemsFilePath, data, "utf8");
}
export async function readNumberOfAllTasks() {
    try {
        const data = await fs.promises.readFile(numberOfAllTasksFilePath, "utf-8");
        return parseInt(data, 10);
    }
    catch (error) {
        console.error("Ошибка чтения файла numberOfAllTasks.json", error);
        return 0;
    }
}
export async function incrementNumberOfAllTasks() {
    const currentNumber = await readNumberOfAllTasks();
    const newNumber = currentNumber + 1;
    try {
        await fs.promises.writeFile(numberOfAllTasksFilePath, newNumber.toString(), "utf-8");
    }
    catch (error) {
        console.error("Ошибка записи в numberOfAllTasks.json", error);
    }
    return newNumber;
}
const server = app.listen(port, () => {
    console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
//# sourceMappingURL=app.js.map