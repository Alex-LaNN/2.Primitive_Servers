import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import sessionConfig from "./sessionConfig.js";
import path from "path";
import { mainPath } from "../../app.js";
import connectToMongoDB from "./mongoDB.js"
import RoutesV1 from "../Routes/RoutesV1.js";
import RoutesV2 from "../Routes/RoutesV2.js";

/**
 * Module of the main application working with the 'MongoDB' database.
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

// To display requests incoming to the server in the console.
app.use(morgan("dev"));
app.use(bodyParser.json());
// Connecting to the database.
connectToMongoDB();

// Connecting 'RoutesV1' as a route for '/api/v1'.
app.use("/api/v1", RoutesV1);
// Connecting 'RoutesV2' as a route for '/api/v2'.
app.use("/api/v2", RoutesV2);

// Start the Express server on the specified port.
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export { app };