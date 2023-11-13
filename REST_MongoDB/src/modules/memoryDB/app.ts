import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import FileStore from "session-file-store";
import path from "path";
import { mainPath } from "../../app.js";
import dotenv from "dotenv";

dotenv.config();

// Creating an Express application.
const app = express();
// The application will use a JSON parser to process JSON requests.
app.use(express.json());
// Using 'CORS' to process CORS requests.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// The value from the 'PORT' environment variable is used, or 3005.
const port = process.env.PORT || 3005;

// Configuring settings for storing sessions on the file system using 'session-file-store'.
const FileStoreOptions = { logFn: function () {} };
const FileStoreInstance = FileStore(session);
app.use(
  session({
    secret: "mysecretkey",
    store: new FileStoreInstance(FileStoreOptions), // Using 'FileStore' to store sessions.
    resave: false, // Do not save a session if nothing has been recorded to it.
    saveUninitialized: true, // Save new sessions even if they have not been modified.
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Processing a request to obtain a client page.
app.use("/client", (req, res) => {
  res.sendFile(path.resolve(mainPath, "./client/index.html"));
});

app.use(bodyParser.json());

// To store the 'id' of the last element.
let lastItemId: number = 0;

// Interface of an array of elements with 'id', 'text' and 'checked' fields.
interface Item {
  id: number;
  text: string;
  checked: boolean;
}

// Creating an array of elements.
const items: Item[] = [];

// Route to get a list of elements.
app.get("/api/v1/items", (req: Request, res: Response) => {
  const itemsResponse = items.map((item) => ({
    id: item.id,
    text: item.text,
    checked: item.checked,
  }));
  res.json({ items: itemsResponse });
});

// Route for creating a new element.
app.post("/api/v1/items", (req: Request, res: Response) => {
  const { text } = req.body;

  if (text) {
    // Increase 'id'.
    lastItemId++;
    // By default 'checked' is 'false' (when the task is relevant).
    const newItem: Item = { id: lastItemId, text, checked: false };
    // Adding a new task to the general list of notes.
    items.push(newItem);
    // Return the 'id' of the added new task.
    res.json({ id: lastItemId });
  } else {
    res.status(400).json({ error: 'The "text" parameter is missing or empty' });
  }
});

// Route to update the element.
app.put("/api/v1/items", (req: Request, res: Response) => {
  // Extract request parameters ('id', 'text' and 'checked' status) from the request body.
  const { id, text, checked } = req.body;
  // Checking the presence of the 'id' parameter in the request.
  if (!id) {
    return res.status(400).json({ error: 'The "id" parameter is missing' });
  }

  // Searching for an element in the 'items' array by 'id'.
  const itemToUpdate = items.find((item) => item.id === id);
  // Checking the presence of an element with the specified 'id'.
  if (!itemToUpdate) {
    return res
      .status(404)
      .json({ error: 'The element with the specified "id" was not found' });
  }

  // Presence of the 'text' parameter in the request => updating the element's text.
  if (text) {
    itemToUpdate.text = text;
  }

  // Updating the 'checked' parameter.
  itemToUpdate.checked = checked;

  // Sending a response (update confirmation).
  res.json({ ok: true });
});

// Route to delete the element.
app.delete("/api/v1/items", (req: Request, res: Response) => {
  // Extracting the 'id' parameter from the 'DELETE request' body.
  const { id } = req.body;
  // Checking for the presence of the 'id' parameter in the request.
  if (!id) {
    return res.status(400).json({ error: 'The "id" parameter is missing' });
  }

  // Finding the index of an element in the 'items' array by 'id'.
  const itemIndex = items.findIndex((item) => item.id === id);
  // Checks whether an element with the specified 'id' is found.
  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ error: 'The element with the specified "id" was not found' });
  }

  // Removing an element from the 'items' array at the found index.
  items.splice(itemIndex, 1);
  res.json({ ok: true });
});

// Defining the interface for user data.
interface User {
  login: string;
  pass: string;
}

// Creating a database with all users.
const users: User[] = [];

// Declaration of the 'express-session' module with the 'SessionData' interface extension.
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

// Route for user authentication (login).
app.post("/api/v1/login", (req, res) => {
  const { login, pass } = req.body;

  // Search for a user with the specified 'login' and 'password'.
  const user = users.find((u) => u.login === login && u.pass === pass);

  if (user) {
    // If the user is found => saving information about him in the session.
    req.session.user = user;

    res.json({ ok: true });
  } else {
    // If the user is not found => error 401 (Unauthorized).
    res.status(401).json({ ok: false });
  }
});

// Route for user exit (session deletion).
app.post("/api/v1/logout", (req, res) => {
  // Deleting a user session.
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Route for registering a new user.
app.post("/api/v1/register", (req, res) => {
  const { login, pass } = req.body;
  // Adding a new user to the database.
  users.push({ login, pass });
  res.json({ ok: true });
});

// Start 'Express server' on the specified port.
const server = app.listen(port, () => {
  console.log(`The server is running on the port: ${port}`);
});

export { app };
