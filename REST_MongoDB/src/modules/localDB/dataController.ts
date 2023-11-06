import fs from "fs";
import path from "path";
import { Item } from "./item.js";
//import { dataBaseFilePath, numberOfAllTasksFilePath } from "./app.js";
import { dataBaseFilePath, numberOfAllTasksFilePath } from "../../app.js";

/*
 Модуль, обеспечивающий работу приложения с базой данных, представляющей собой набор файлов.
*/

// Функция для загрузки пользователей из файла dbUsers.json.
export async function loadUsersFromDb() {
  const dbUsersFilePath = path.resolve(dataBaseFilePath, "./dbUsers.json");
  try {
    const dbData = await fs.promises.readFile(dbUsersFilePath, "utf-8");
    return JSON.parse(dbData);
  } catch (error) {
    // Если произошла ошибка при чтении файла => возвращается пустой массив.
    return [];
  }
}

// Функция для поиска пользователя по логину и паролю в файле dbUsers.json.
export async function findUserInDb(login: string, pass: string) {
  try {
    const users = await loadUsersFromDb();
    return users.find(
      (user: any) => user.login === login && user.pass === pass
    );
  } catch (error) {
    // Обработка ошибки чтения из базы данных
    console.error("Error while reading users from the database:", error);
    return null;
  }
}

// Функция для сохранения пользователей в файл 'dbUsers.json'.
export async function saveUsersToDb(users: string) {
  // Преобразование в формат JSON с отступами для удобного чтения.
  const data = JSON.stringify(users, null, 2);
  await fs.promises.writeFile("dbUsers.json", data, "utf8");
}

// Функция для регистрации нового пользователя.
export async function registerUser(login: string, pass: string) {
  const users = await loadUsersFromDb();
  users.push({ login, pass });
  await saveUsersToDb(users);
}

// Функция для загрузки всех задач из файла dbItems.json.
export async function loadItemsFromDb() {
  // Получение адреса общего файла со всеми тасками всех юзеров.
  const dbItemsFilePath = path.resolve(dataBaseFilePath, "./dbItems.json");
  try {
    const dbData = await fs.promises.readFile(dbItemsFilePath, "utf-8");
    return JSON.parse(dbData);
  } catch (error) {
    // Если произошла ошибка при чтении файла или файл не существует => пустой объект.
    // (обработка данной ошибки - в месте вызова функции)
    return {};
  }
}

// Функция для сохранения всех задач в файл dbItems.json.
export async function saveItemsToDb(items: Record<string, Item[]>) {
  //const dbItemsFilePath = path.resolve(mainPath, "dbItems.json");
  const dbItemsFilePath = path.resolve(dataBaseFilePath, "./dbItems.json");
  const data = JSON.stringify(items, null, 2);
  await fs.promises.writeFile(dbItemsFilePath, data, "utf8");
}

// Функция для чтения текущего значения ID из файла
export async function readNumberOfAllTasks() {
  try {
    const data = await fs.promises.readFile(numberOfAllTasksFilePath, "utf-8");
    return parseInt(data, 10); // Преобразовывание к числу.
  } catch (error) {
    console.error("Ошибка чтения файла numberOfAllTasks.json", error);
    return 0; // по умолчанию.
  }
}

// Функция для увеличения значения ID и записи его в файл.
export async function incrementNumberOfAllTasks() {
  const currentNumber = await readNumberOfAllTasks();
  const newNumber = currentNumber + 1;
  try {
    await fs.promises.writeFile(
      numberOfAllTasksFilePath,
      newNumber.toString(),
      "utf-8"
    );
  } catch (error) {
    console.error("Ошибка записи в numberOfAllTasks.json", error);
  }
  return newNumber;
}
