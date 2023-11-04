import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import sessionConfig from "./modules/sessionConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import RoutesV1 from "./modules/localDB/RoutesV1.js";
import RoutesV2 from "./modules/localDB/RoutesV2.js";
import dotenv from "dotenv";
dotenv.config();
const appFilePath = fileURLToPath(import.meta.url);
const mainPath = path.dirname(path.dirname(appFilePath));
export const dataBaseFilePath = mainPath + "/src/modules/localDB/dataBase";
export const numberOfAllTasksFilePath = dataBaseFilePath + "/numberOfAllTasks.json";
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
const port = process.env.PORT || 3005;
app.use(session(sessionConfig));
app.use("/client", (req, res) => {
    res.sendFile(path.resolve(mainPath, "./client/index.html"));
});
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", RoutesV1);
app.use("/api/v2", RoutesV2);
const server = app.listen(port, () => {
    console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
//# sourceMappingURL=app.js.map