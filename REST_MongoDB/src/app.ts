import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Корневой путь.
export const mainPath = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const dataBaseFilePath = mainPath + "/src/modules/localDB/dataBase";
// Путь к файлу со значением количества всех задач, написанных пользователями.
export const numberOfAllTasksFilePath =
  dataBaseFilePath + "/numberOfAllTasks.json";

// Чтение значения DB_TYPE из .env
const dbType: string | undefined = process.env.DB_TYPE;
console.log(`18 dbType: ${dbType}`);

// Выбор дальнейшей логики программы в зависимости от выбранного типа используемой БД.
let app: any;
async function importApp() {
   if (dbType === "local") {
    const { app: localApp } = await import("./modules/localDB/app.js");
    app = localApp;
  } else if (dbType === "mongo") {
    const { app: mongoApp } = await import("./modules/mongoDB/app.js");
    app = mongoApp;
  } else {
    const { app: memoryApp } = await import("./modules/memoryDB/app.js");
    app = memoryApp;
  }
}

importApp();

export { app };
