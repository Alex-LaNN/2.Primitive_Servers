import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import FileStore from "session-file-store";
import path from "path";
import { mainPath } from "../../app.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
const port = process.env.PORT || 3005;
const FileStoreOptions = { logFn: function () { } };
const FileStoreInstance = FileStore(session);
app.use(session({
    secret: "mysecretkey",
    store: new FileStoreInstance(FileStoreOptions),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use("/client", (req, res) => {
    res.sendFile(path.resolve(mainPath, "./client/index.html"));
});
app.use(bodyParser.json());
let lastItemId = 0;
const items = [];
app.get("/api/v1/items", (req, res) => {
    const itemsResponse = items.map((item) => ({
        id: item.id,
        text: item.text,
        checked: item.checked,
    }));
    res.json({ items: itemsResponse });
});
app.post("/api/v1/items", (req, res) => {
    const { text } = req.body;
    if (text) {
        lastItemId++;
        const newItem = { id: lastItemId, text, checked: false };
        items.push(newItem);
        res.json({ id: lastItemId });
    }
    else {
        res.status(400).json({ error: 'The "text" parameter is missing or empty' });
    }
});
app.put("/api/v1/items", (req, res) => {
    const { id, text, checked } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'The "id" parameter is missing' });
    }
    const itemToUpdate = items.find((item) => item.id === id);
    if (!itemToUpdate) {
        return res
            .status(404)
            .json({ error: 'The element with the specified "id" was not found' });
    }
    if (text) {
        itemToUpdate.text = text;
    }
    itemToUpdate.checked = checked;
    res.json({ ok: true });
});
app.delete("/api/v1/items", (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'The "id" parameter is missing' });
    }
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res
            .status(404)
            .json({ error: 'The element with the specified "id" was not found' });
    }
    items.splice(itemIndex, 1);
    res.json({ ok: true });
});
const users = [];
app.post("/api/v1/login", (req, res) => {
    const { login, pass } = req.body;
    const user = users.find((u) => u.login === login && u.pass === pass);
    if (user) {
        req.session.user = user;
        res.json({ ok: true });
    }
    else {
        res.status(401).json({ ok: false });
    }
});
app.post("/api/v1/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
});
app.post("/api/v1/register", (req, res) => {
    const { login, pass } = req.body;
    users.push({ login, pass });
    res.json({ ok: true });
});
const server = app.listen(port, () => {
    console.log(`The server is running on the port: ${port}`);
});
export { app };
