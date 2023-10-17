import express from "express";
import bodyParser from 'body-parser';
import session from "express-session";
import FileStore from "session-file-store";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const parentDir = path.dirname(currentDir);
const app = express();
app.use(express.json());
const port = process.env.PORT || 3005;
const FileStoreOptions = {};
const FileStoreInstance = FileStore(session);
app.use(session({
    secret: 'mysecretkey',
    store: new FileStoreInstance(FileStoreOptions),
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use("/client", (req, res) => {
    res.sendFile(path.resolve(currentDir, "../client/index.html"));
});
app.use(bodyParser.json());
app.get('/api/v1/items', (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }
    const itemsDb = loadItemsFromDb();
    const userItems = itemsDb[currentUser.login] || [];
    res.json({ items: userItems });
});
app.post('/api/v1/items', (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }
    const { text } = req.body;
    if (!text) {
        return res
            .status(400)
            .json({ error: 'Параметр "text" отсутствует или пуст' });
    }
    const itemsDb = loadItemsFromDb();
    const userItems = itemsDb[currentUser.login] || [];
    const lastItemId = userItems.length > 0
        ? Math.max(...userItems.map((item) => item.id))
        : 0;
    const newItem = { id: lastItemId + 1, text, checked: false };
    userItems.push(newItem);
    itemsDb[currentUser.login] = userItems;
    saveItemsToDb(itemsDb);
    res.json({ id: newItem.id });
});
app.put('/api/v1/items', (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }
    const { id, text, checked } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }
    const itemsDb = loadItemsFromDb();
    const userItems = itemsDb[currentUser.login] || [];
    const itemIndex = userItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res
            .status(404)
            .json({ error: 'Элемент с указанным "id" не найден' });
    }
    if (text) {
        userItems[itemIndex].text = text;
    }
    if (typeof checked === "boolean") {
        userItems[itemIndex].checked = checked;
    }
    itemsDb[currentUser.login] = userItems;
    saveItemsToDb(itemsDb);
    res.json({ ok: true });
});
app.delete('/api/v1/items', (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }
    const itemsDb = loadItemsFromDb();
    const userItems = itemsDb[currentUser.login] || [];
    const itemIndex = userItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res
            .status(404)
            .json({ error: 'Элемент с указанным "id" не найден' });
    }
    userItems.splice(itemIndex, 1);
    itemsDb[currentUser.login] = userItems;
    saveItemsToDb(itemsDb);
    res.json({ ok: true });
});
app.post('/api/v1/login', (req, res) => {
    const { login, pass } = req.body;
    const user = findUserInDb(login, pass);
    if (user) {
        req.session.regenerate((error) => {
            if (error) {
                console.log(`${error}`);
                return;
            }
            req.session.user = user;
            req.session.save((err) => {
                console.log(`${err}`);
                res.json({ ok: true });
            });
        });
    }
    else {
        res.status(401).json({ ok: false });
    }
});
app.post('/api/v1/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
});
app.post('/api/v1/register', (req, res) => {
    const { login, pass } = req.body;
    if (!login || !pass) {
        return res.status(400).json({ error: "Логин и пароль обязательны" });
    }
    const existingUser = loadUsersFromDb().find((user) => user.login === login);
    if (existingUser) {
        return res
            .status(400)
            .json({ error: "Пользователь с таким логином уже существует" });
    }
    registerUser(login, pass);
    res.json({ ok: true });
});
function loadUsersFromDb() {
    const dbFilePath = path.resolve(currentDir, "../dbUsers.json");
    try {
        const dbData = fs.readFileSync(dbFilePath, 'utf-8');
        return JSON.parse(dbData);
    }
    catch (error) {
        return [];
    }
}
function findUserInDb(login, pass) {
    const users = loadUsersFromDb();
    console.dir(`334 findUserInDb(): ${JSON.stringify(users)}`);
    return users.find((user) => user.login === login && user.pass === pass);
}
function saveUsersToDb(users) {
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync("dbUsers.json", data, "utf8");
}
function registerUser(login, pass) {
    const users = loadUsersFromDb();
    users.push({ login, pass });
    saveUsersToDb(users);
}
function loadItemsFromDb() {
    const dbFilePath = path.resolve(parentDir, "dbItems.json");
    try {
        const dbData = fs.readFileSync(dbFilePath, 'utf-8');
        return JSON.parse(dbData);
    }
    catch (error) {
        return {};
    }
}
function saveItemsToDb(items) {
    const dbFilePath = path.resolve(parentDir, "dbItems.json");
    const data = JSON.stringify(items, null, 2);
    fs.writeFileSync(dbFilePath, data, 'utf8');
}
const server = app.listen(port, () => {
    console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
//# sourceMappingURL=app.js.map