import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { app as memoryApp } from "./modules/memoryDB/app.js";
dotenv.config();
export const mainPath = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const dataBaseFilePath = mainPath + "/src/modules/localDB/dataBase";
export const numberOfAllTasksFilePath = dataBaseFilePath + "/numberOfAllTasks.json";
const dbType = process.env.DB_TYPE;
let app;
if (dbType === "memory") {
    app = memoryApp;
}
else if (dbType === "local") {
}
//# sourceMappingURL=app.js.map