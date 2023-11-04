import express from "express";
//import mongoose from "mongoose"
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import sessionConfig from "./modules/sessionConfig.js";
import path from "path";
import { fileURLToPath } from "url";
//import RoutesV1 from "./modules/RoutesV1.js";
import RoutesV1 from "./modules/localDB/RoutesV1.js";
//import RoutesV2 from "./modules/RoutesV2.js";
import RoutesV2 from "./modules/localDB/RoutesV2.js";
//import Task from "./modules/models/task.js"
import dotenv from "dotenv";

dotenv.config();

// Путь к скомпилированному файлу приложения 'app.js'.
const appFilePath = fileURLToPath(import.meta.url);
// Корневой путь.
const mainPath = path.dirname(path.dirname(appFilePath));
export const dataBaseFilePath = mainPath + "/src/modules/localDB/dataBase";
// Путь к файлу со значением количества всех задач, написанных пользователями.
export const numberOfAllTasksFilePath = dataBaseFilePath + "/numberOfAllTasks.json";

// Создание Express-приложения.
const app = express();
// Приложение будет использовать JSON-парсер.
app.use(express.json());
// Использование 'CORS' для обработки CORS-запросов.
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
// Используется значение из переменной окружения PORT, либо 3005.
const port = process.env.PORT || 3005;

// const db = "mongodb+srv://Alex:55555@atlascluster.ff0zduv.mongodb.net/";
// mongoose
//   .connect(db)
//   .then((res) => console.log(`Connected to MongoDB...`))
//   .catch((error) => console.log(`error`))

// Используются настройки сессии из sessionConfig.
app.use(session(sessionConfig));

// Обработка запроса для получения страницы клиента.
app.use("/client", (req, res) => {
  res.sendFile(path.resolve(mainPath, "./client/index.html"));
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Подключение 'RoutesV1' как маршрут для '/api/v1'.
app.use("/api/v1", RoutesV1);
// Подключение 'RoutesV2' как маршрут для '/api/v2'.
app.use("/api/v2", RoutesV2);

// Запуск Express-сервера на указанном порту.
const server = app.listen(port, () => {
  console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
