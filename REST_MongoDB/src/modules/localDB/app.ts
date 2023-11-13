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

/*
 The main application module that works with a database, which is a set of files.
*/

dotenv.config();

// Creating an Express application.
const app = express();
// The application will use a JSON parser.
app.use(express.json());
// Using 'CORS' to process CORS requests.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// The value from the PORT environment variable, or 3005, is used.
const port = process.env.PORT || 3005;

// The session settings from sessionConfig are used.
app.use(session(sessionConfig));

// Processing a request to obtain a client page.
app.use("/client", (req: any, res: any) => {
  res.sendFile(path.resolve(mainPath, "./client/index.html"));
});

app.use(morgan("dev")); // displaying incoming requests in the console.
app.use(bodyParser.json());

// Connecting 'RoutesV1' as a route for '/api/v1'.
app.use("/api/v1", RoutesV1);
// Connecting 'RoutesV2' as a route for '/api/v2'.
app.use("/api/v2", RoutesV2);

// Start the Express server on the specified port.
const server = app.listen(port, () => {
  console.log(`The server is running on the port: ${port}`);
});

export { app };
