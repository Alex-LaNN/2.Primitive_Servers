import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import sessionFileStore from "session-file-store";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import sessionConfig from "./sessionConfig.js";
import path from "path";
import { mainPath } from "../../app.js";
import connectToMongoDB from "./mongoDB.js"
import RoutesV1 from "../Routes/RoutesV1.js";
import RoutesV2 from "../Routes/RoutesV2.js";

dotenv.config();

// Создание Express-приложения.
const app = express();
// Приложение будет использовать JSON-парсер.
app.use(express.json());
// Использование 'CORS' для обработки CORS-запросов.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// Используется значение из переменной окружения PORT, либо 3005.
const port = process.env.PORT || 3005;

// Используются настройки сессии из sessionConfig.
app.use(session(sessionConfig));

interface FileStore {
  [key: string]: any;
}
const FileStore = sessionFileStore(session);
export default FileStore;

// Обработка запроса для получения страницы клиента.
app.use("/client", (req: any, res: any) => {
  res.sendFile(path.resolve(mainPath, "./client/index.html"));
});

app.use(morgan("dev"));
app.use(bodyParser.json());
connectToMongoDB();

// Подключение 'RoutesV1' как маршрут для '/api/v1'.
app.use("/api/v1", RoutesV1);
// Подключение 'RoutesV2' как маршрут для '/api/v2'.
app.use("/api/v2", RoutesV2);

// Запуск Express-сервера на указанном порту.
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export { app };