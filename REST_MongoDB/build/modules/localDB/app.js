import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import sessionConfig from "../session/sessionConfig.js";
import path from "path";
import { mainPath } from "../../app.js";
import RoutesV1 from "../Routes/RoutesV1.js";
import RoutesV2 from "../Routes/RoutesV2.js";
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
app.use("/api/v1", RoutesV1);
app.use("/api/v2", RoutesV2);
const server = app.listen(port, () => {
    console.log(`The server is running on the port: ${port}`);
});
export { app };
