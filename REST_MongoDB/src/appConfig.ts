import dotenv from "dotenv";
dotenv.config();

// Чтение значения DB_TYPE из .env
const dbType: string | undefined = process.env.DB_TYPE;

// Импорт модуля для работы с выбранной базой данных.
let mainApp: any; // Здесь тип any использован для общности, лучше было бы определить типы для app.

if (dbType === "local") {
  mainApp = require("./modules/localDB/app.js").app;
} else if (dbType === "mongo") {
  mainApp = require("./mongoApp.js").app;
} else if (dbType === "memory") {
  mainApp = require("./modules/memoryDB/app.js").app;
} else if (dbType === "mysql") {
  mainApp = require("./mysqlApp.js").app;
}

export { mainApp as app };