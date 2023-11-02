import fs from "fs";
import path from "path";
import { dataBaseFilePath, numberOfAllTasksFilePath } from "../app.js";
export async function loadUsersFromDb() {
    const dbUsersFilePath = path.resolve(dataBaseFilePath, "./dbUsers.json");
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
    const dbItemsFilePath = path.resolve(dataBaseFilePath, "./dbItems.json");
    try {
        const dbData = await fs.promises.readFile(dbItemsFilePath, "utf-8");
        return JSON.parse(dbData);
    }
    catch (error) {
        return {};
    }
}
export async function saveItemsToDb(items) {
    const dbItemsFilePath = path.resolve(dataBaseFilePath, "./dbItems.json");
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
//# sourceMappingURL=dataController.js.map