import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import sessionConfig from "./sessionConfig.js";
import path from "path";
import { mainPath } from "../../app.js";
import connectToMongoDB from "./mongoDB.js";
import RoutesV1 from "./RoutesV1.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
const port = process.env.PORT || 3005;
app.use(session(sessionConfig));
app.use("/client", (req, res) => {
    res.sendFile(path.resolve(mainPath, "./client/index.html"));
});
app.use(morgan("dev"));
app.use(bodyParser.json());
connectToMongoDB();
app.use("/api/v1", RoutesV1);
const server = app.listen(port, () => {
    console.log(`Сервер запущен на порту: ${port}`);
});
export { app };
//# sourceMappingURL=app.js.map