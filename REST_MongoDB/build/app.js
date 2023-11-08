import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
export const mainPath = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const dataBaseFilePath = mainPath + "/src/modules/localDB/dataBase";
export const numberOfAllTasksFilePath = dataBaseFilePath + "/numberOfAllTasks.json";
const dbType = process.env.DB_TYPE;
console.log(`18 dbType: ${dbType}`);
let app;
async function importApp() {
    if (dbType === "memory") {
        const { app: memoryApp } = await import("./modules/memoryDB/app.js");
        app = memoryApp;
    }
    else if (dbType === "local") {
        const { app: localApp } = await import("./modules/localDB/app.js");
        app = localApp;
    }
    else if (dbType === "mongo") {
        const { app: mongoApp } = await import("./modules/mongoDB/app.js");
        app = mongoApp;
    }
}
importApp();
export { app };
//# sourceMappingURL=app.js.map