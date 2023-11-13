import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
export const mainPath = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const dataBaseFilePath = mainPath + "/src/modules/localDB/dataBase";
export const numberOfAllTasksFilePath = dataBaseFilePath + "/numberOfAllTasks.json";
const dbType = process.env.DB_TYPE;
let app;
async function getDbForUsage() {
    if (dbType === "local") {
        const { app: localApp } = await import("./modules/localDB/app.js");
        console.log(`The selected value of the database used is 'local'`);
        app = localApp;
    }
    else if (dbType === "mongo") {
        const { app: mongoApp } = await import("./modules/mongoDB/app.js");
        console.log(`The selected value of the database used is 'mongo'`);
        app = mongoApp;
    }
    else {
        const { app: memoryApp } = await import("./modules/memoryDB/app.js");
        console.log(`The default database used is 'memory'`);
        app = memoryApp;
    }
}
getDbForUsage();
export { app };
