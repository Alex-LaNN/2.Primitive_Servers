import fs from "fs";
import path from "path";
import { Item } from "./item.js";
import { dataBaseFilePath, numberOfAllTasksFilePath } from "../../app.js";

/*
 A module that allows an application to work with a database, which is a set of files.
*/

// Function for loading users from the 'dbUsers.json' file.
export async function loadUsersFromDb() {
  const dbUsersFilePath = path.resolve(dataBaseFilePath, "./dbUsers.json");
  try {
    const dbData = await fs.promises.readFile(dbUsersFilePath, "utf-8");
    return JSON.parse(dbData);
  } catch (error) {
    // If an error occurs while reading the file => an empty array is returned.
    return [];
  }
}

// A function for searching for a user by login and password in the 'dbUsers.json' file.
export async function findUserInDb(login: string) {
  try {
    const users = await loadUsersFromDb();
    return users.find((user: any) => user.login === login);
  } catch (error) {
    // Handling a read error from the database.
    console.error("Error while reading users from the database:", error);
    return null;
  }
}

// Function for saving users to the 'dbUsers.json' file.
export async function saveUsersToDb(users: string) {
  // Convert to JSON format with indentation for easy reading.
  const data = JSON.stringify(users, null, 2);
  // Getting the path to the file to write to.
  const dBUsersFilePath = path.resolve(dataBaseFilePath, "./dbUsers.json");
  try {
    await fs.promises.writeFile(dBUsersFilePath, data, "utf8");
  } catch (err) {
    console.log(`43 dC: Error write file to DB: ${err}`);
  }
}

// Function for registering a new user.
export async function registerUser(login: string, pass: string) {
  const users = await loadUsersFromDb();
  users.push({ login, pass });
  await saveUsersToDb(users);
}

// Function to load all tasks from the 'dbItems.json' file.
export async function loadItemsFromDb() {
  // Obtaining the address of a common file with all tasks of all users.
  const dbItemsFilePath = path.resolve(dataBaseFilePath, "./dbItems.json");
  try {
    const dbData = await fs.promises.readFile(dbItemsFilePath, "utf-8");
    return JSON.parse(dbData);
  } catch (error) {
    // If an error occurred while reading the file or the file does not exist => empty object.
    return {};
  }
}

// Function for saving all tasks to the 'dbItems.json' file.
export async function saveItemsToDb(items: Record<string, Item[]>) {
  // Getting the path to the file to save.
  const dbItemsFilePath = path.resolve(dataBaseFilePath, "./dbItems.json");
  const data = JSON.stringify(items, null, 2);
  await fs.promises.writeFile(dbItemsFilePath, data, "utf8");
}

// Function to read the current value of the last used 'id' from a file.
export async function readNumberOfAllTasks() {
  try {
    const data = await fs.promises.readFile(numberOfAllTasksFilePath, "utf-8");
    return parseInt(data, 10); // Convert to number.
  } catch (error) {
    console.error("Error reading file 'numberOfAllTasks.json'", error);
    return 0; // default.
  }
}

// Function to increment the value of the last used 'id' and write it to a file.
export async function incrementNumberOfAllTasks() {
  const currentNumber: any = await readNumberOfAllTasks();
  // Elimination of errors in the operation of the database at the very beginning, during its initialization.
  let newNumber: number;
  if (currentNumber > 0) {
    newNumber = currentNumber + 1;
  } else {
    newNumber = 1;
  }
  // Saving the last used 'id' to the database (file).
  try {
    await fs.promises.writeFile(
      numberOfAllTasksFilePath,
      newNumber.toString(),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing to 'numberOfAllTasks.json'", error);
  }
  return newNumber;
}
