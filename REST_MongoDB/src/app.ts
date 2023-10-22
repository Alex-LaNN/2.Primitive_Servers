import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { User } from "./modules/user.js";
import { Item } from "./modules/item.js";
import * as taskController from "./modules/taskController.js";
import * as userController from "./modules/userController.js";
import sessionConfig from "./modules/sessionConfig.js";

// Путь к скомпилированному файлу приложения 'app.js'.
const appFilePath = fileURLToPath(import.meta.url);
console.log(`appFilePath: ${appFilePath}`);
// Путь к файлу хранения всех задач, написанных пользователями.
const buildPath = path.dirname(appFilePath);
console.log(`buildPath: ${buildPath}`);
// Корневой путь.
const mainPath = path.dirname(buildPath);
const dbUtilsFileParts = path.dirname(buildPath) + "/src/modules/dbUtils";
console.log(`mainPath: ${mainPath}`)
// Путь к файлу со значением количества всех задач, написанных пользователями.
const numberOfAllTasksFilePath = mainPath + "/src/modules/dbUtils/numberOfAllTasks.json";

// Создание Express-приложения.
const app = express();
// Приложение будет использовать JSON-парсер для обработки JSON-запросов.
app.use(express.json());
// Используется значение из переменной окружения PORT, либо 3005.
const port = process.env.PORT || 3005;

// Используются настройки сессии из sessionConfig.
app.use(session(sessionConfig));

// Объявление модуля "express-session" с расширением интерфейса 'SessionData'.
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

// Обработка запроса для получения страницы клиента.
app.use("/client", (req, res) => {
  res.sendFile(path.resolve(mainPath, "./client/index.html"));
});

app.use(bodyParser.json());

// Роут для получения списка задач текущего пользователя.
app.get("/api/v1/items", taskController.getItems);

// Роут для создания новой задачи текущего пользователя.
app.post("/api/v1/items", taskController.createItem);

// Роут для обновления задачи текущего пользователя.
app.put("/api/v1/items", taskController.updateItem);

// Роут для удаления задачи текущего пользователя.
app.delete("/api/v1/items", taskController.deleteItem);

// Роут для аутентификации (входа) пользователя.
app.post("/api/v1/login", userController.login);

// Роут для выхода пользователя (удаления сессии).
app.post("/api/v1/logout", userController.logout);

// Роут для регистрации нового пользователя.
app.post("/api/v1/register", userController.register);

// Функция для загрузки пользователей из файла dbUsers.json.
export async function loadUsersFromDb() {
  //const dbUsersFilePath = path.resolve(mainPath, "./dbUsers.json");
  const dbUsersFilePath = path.resolve(dbUtilsFileParts, "./dbUsers.json");
  console.log(`74 dbUsersFilePath: ${dbUsersFilePath}`)
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
  //const dbItemsFilePath = path.resolve(mainPath, "/src/modules/dbUtils/dbItems.json");
  const dbItemsFilePath = path.resolve(dbUtilsFileParts, "./dbItems.json");
  console.log(`116 dbItemsFilePath: ${dbItemsFilePath}`);
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
  const dbItemsFilePath = path.resolve(dbUtilsFileParts, "./dbItems.json");
  console.log(`130 dbItemsFilePath: ${dbItemsFilePath}`);
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

// Запуск Express-сервера на указанном порту.
const server = app.listen(port, () => {
  console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
