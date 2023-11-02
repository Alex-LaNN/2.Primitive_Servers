import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import sessionConfig from "./modules/sessionConfig.js";
import RoutesV1 from "./modules/RoutesV1.js";
import RoutesV2 from "./modules/RoutesV2.js";
const appFilePath = fileURLToPath(import.meta.url);
const mainPath = path.dirname(path.dirname(appFilePath));
export const dataBaseFilePath = mainPath + "/src/modules/dataBase";
export const numberOfAllTasksFilePath = dataBaseFilePath + "/numberOfAllTasks.json";
const app = express();
app.use(express.json());
const port = process.env.PORT || 3005;
app.use(session(sessionConfig));
app.use("/client", (req, res) => {
    res.sendFile(path.resolve(mainPath, "./client/index.html"));
});
app.use(bodyParser.json());
app.use("/api/v1", RoutesV1);
app.use("/api/v2", RoutesV2);
const server = app.listen(port, () => {
    console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
//# sourceMappingURL=app.js.map