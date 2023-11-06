import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { app as localApp } from "./modules/localDB/app.js";
import { app as memoryApp } from "./modules/memoryDB/app.js";

dotenv.config();

// Корневой путь.
export const mainPath = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const dataBaseFilePath = mainPath + "/src/modules/localDB/dataBase";
// Путь к файлу со значением количества всех задач, написанных пользователями.
export const numberOfAllTasksFilePath =
  dataBaseFilePath + "/numberOfAllTasks.json";

// Чтение значения DB_TYPE из .env
const dbType: string | undefined = process.env.DB_TYPE;

// Импорт модуля для работы с выбранной базой данных.
let app;

if (dbType === "memory") {
  app = memoryApp;
} else if (dbType === "local") {
//  app = localApp;
}

  // if (app) {
  //   const port: number = parseInt(process.env.PORT || "3005", 10);

  //   // Запуск Express-сервера на указанном порту.
  //   const server = app.listen(port, () => {
  //     console.log(`-(app)- Сервер запущен на порту: ${port}`);
  //   });
  // }
