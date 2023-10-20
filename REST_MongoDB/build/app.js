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
const numberOfAllTasksFileDir = path.dirname(currentDir) + "/numberOfAllTask.json";
const app = express();
app.use(express.json());
const port = process.env.PORT || 3005;
const FileStoreOptions = {};
const FileStoreInstance = FileStore(session);
app.use(session({
    secret: "my_usual_lightweight_secret_key",
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
app.get('/api/v1/items', async (req, res) => {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.status(401).json({ error: "Пользователь не аутентифицирован" });
        }
        const itemsDb = await loadItemsFromDb();
        const userItems = itemsDb[currentUser.login] || [];
        res.json({ items: userItems });
    }
    catch (error) {
        console.error("Error while handling GET /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post('/api/v1/items', async (req, res) => {
    try {
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
        const itemsDb = await loadItemsFromDb();
        const userItems = itemsDb[currentUser.login] || [];
        const newId = await incrementNumberOfAllTasks();
        const newItem = { id: newId, text, checked: false };
        userItems.push(newItem);
        itemsDb[currentUser.login] = userItems;
        await saveItemsToDb(itemsDb);
        res.json({ id: newItem.id });
    }
    catch (error) {
        console.error("Error while handling POST /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.put('/api/v1/items', async (req, res) => {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.status(401).json({ error: "Пользователь не аутентифицирован" });
        }
        const { id, text, checked } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Параметр "id" отсутствует' });
        }
        const itemsDb = await loadItemsFromDb();
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
        await saveItemsToDb(itemsDb);
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error while handling PUT /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.delete('/api/v1/items', async (req, res) => {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.status(401).json({ error: "Пользователь не аутентифицирован" });
        }
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Параметр "id" отсутствует' });
        }
        const itemsDb = await loadItemsFromDb();
        const userItems = itemsDb[currentUser.login] || [];
        const itemIndex = userItems.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            return res
                .status(404)
                .json({ error: 'Элемент с указанным "id" не найден' });
        }
        userItems.splice(itemIndex, 1);
        itemsDb[currentUser.login] = userItems;
        await saveItemsToDb(itemsDb);
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error while handling DELETE /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/api/v1/login", async (req, res) => {
    try {
        const { login, pass } = req.body;
        const user = await findUserInDb(login, pass);
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
    }
    catch (error) {
        console.error("Error while handling POST /api/v1/login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/api/v1/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
});
app.post('/api/v1/register', async (req, res) => {
    try {
        const { login, pass } = req.body;
        if (!login || !pass) {
            return res.status(400).json({ error: "Логин и пароль обязательны" });
        }
        const users = await loadUsersFromDb();
        const existingUser = users.find((user) => user.login === login);
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Пользователь с таким логином уже существует" });
        }
        await registerUser(login, pass);
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error while handling POST /api/v1/register:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
async function loadUsersFromDb() {
    const dbFilePath = path.resolve(currentDir, "../dbUsers.json");
    try {
        const dbData = await fs.promises.readFile(dbFilePath, 'utf-8');
        return JSON.parse(dbData);
    }
    catch (error) {
        return [];
    }
}
async function findUserInDb(login, pass) {
    try {
        const users = await loadUsersFromDb();
        console.dir(`283 findUserInDb(): ${JSON.stringify(users)}`);
        return users.find((user) => user.login === login && user.pass === pass);
    }
    catch (error) {
        console.error("Error while reading users from the database:", error);
        return null;
    }
}
async function saveUsersToDb(users) {
    const data = JSON.stringify(users, null, 2);
    await fs.promises.writeFile("dbUsers.json", data, "utf8");
}
async function registerUser(login, pass) {
    const users = await loadUsersFromDb();
    users.push({ login, pass });
    await saveUsersToDb(users);
}
async function loadItemsFromDb() {
    const dbFilePath = path.resolve(parentDir, "dbItems.json");
    try {
        const dbData = await fs.promises.readFile(dbFilePath, "utf-8");
        return JSON.parse(dbData);
    }
    catch (error) {
        return {};
    }
}
async function saveItemsToDb(items) {
    const dbFilePath = path.resolve(parentDir, "dbItems.json");
    const data = JSON.stringify(items, null, 2);
    await fs.promises.writeFile(dbFilePath, data, 'utf8');
}
async function readNumberOfAllTasks() {
    try {
        const data = await fs.promises.readFile(numberOfAllTasksFileDir, "utf-8");
        return parseInt(data, 10);
    }
    catch (error) {
        console.error('Ошибка чтения файла numberOfAllTasks.json', error);
        return 0;
    }
}
async function incrementNumberOfAllTasks() {
    const currentNumber = await readNumberOfAllTasks();
    const newNumber = currentNumber + 1;
    try {
        await fs.promises.writeFile(numberOfAllTasksFileDir, newNumber.toString(), 'utf-8');
    }
    catch (error) {
        console.error('Ошибка записи в numberOfAllTasks.json', error);
    }
    return newNumber;
}
const server = app.listen(port, () => {
    console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
//# sourceMappingURL=app.js.map