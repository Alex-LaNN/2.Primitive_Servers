import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import sessionConfig from "./modules/sessionConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import RoutesV1 from "./modules/RoutesV1.js";
import RoutesV2 from "./modules/RoutesV2.js";

// Путь к скомпилированному файлу приложения 'app.js'.
const appFilePath = fileURLToPath(import.meta.url);
// Корневой путь.
const mainPath = path.dirname(path.dirname(appFilePath));
export const dataBaseFilePath = mainPath + "/src/modules/dataBase";
// Путь к файлу со значением количества всех задач, написанных пользователями.
export const numberOfAllTasksFilePath = dataBaseFilePath + "/numberOfAllTasks.json";

// Создание Express-приложения.
const app = express();
// Приложение будет использовать JSON-парсер.
app.use(express.json());
// Используется значение из переменной окружения PORT, либо 3005.
const port = process.env.PORT || 3005;

// Используются настройки сессии из sessionConfig.
app.use(session(sessionConfig));

// Обработка запроса для получения страницы клиента.
app.use("/client", (req, res) => {
  res.sendFile(path.resolve(mainPath, "./client/index.html"));
});

app.use(bodyParser.json());

// Подключение 'RoutesV1' как маршрут для '/api/v1'.
app.use("/api/v1", RoutesV1);
// Подключение 'RoutesV2' как маршрут для '/api/v2'.
app.use("/api/v2", RoutesV2);

// Запуск Express-сервера на указанном порту.
const server = app.listen(port, () => {
  console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
