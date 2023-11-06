import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
//import sessionConfig from "../sessionConfig.js";
import FileStore from "session-file-store";
import path from "path";
import { mainPath } from "../../app.js";
import dotenv from "dotenv";

dotenv.config();

// Создание Express-приложения.
const app = express();
// Приложение будет использовать JSON-парсер для обработки JSON-запросов.
app.use(express.json());
// Использование 'CORS' для обработки CORS-запросов.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// Используется значение из переменной окружения PORT, либо 3005.
const port = process.env.PORT || 3005;

// // Используются настройки сессии из sessionConfig.
// app.use(session(sessionConfig));

// Обработка запроса для получения страницы клиента.
app.use("/client", (req, res) => {
  res.sendFile(path.resolve(mainPath, "./client/index.html"));
});

//app.use(cors());
app.use(bodyParser.json());

// Для хранения ID последнего элемента.
let lastItemId: number = 0;

// Интерфейс массива элементов с полями id, text и completed.
interface Item {
  id: number;
  text: string;
  completed: boolean;
}

// Создание массива элементов.
const items: Item[] = [];

// Роут для получения списка элементов.
app.get("/api/v1/items", (req: Request, res: Response) => {
  const itemsResponse = items.map((item) => ({
    id: item.id,
    text: item.text,
    completed: item.completed,
  }));
  res.json({ items: itemsResponse });
});

// Роут для создания нового элемента.
app.post("/api/v1/items", (req: Request, res: Response) => {
  const { text } = req.body;

  if (text) {
    // Увеличение ID.
    lastItemId++;
    // По умолчанию "completed" равно false (когда задача не выполнена еще).
    const newItem: Item = { id: lastItemId, text, completed: false };
    // Добавление новой задачи в общий список заметок.
    items.push(newItem);
    // Возвращение 'id' добавленной новой задачи.
    res.json({ id: lastItemId });
  } else {
    res.status(400).json({ error: 'Параметр "text" отсутствует или пуст' });
  }
});

// Роут для обновления элемента.
app.put("/api/v1/items", (req: Request, res: Response) => {
  // Извлечение параметров запроса (ID, текст и статус "completed") из тела запроса (в формате JSON).
  const { id, text, completed } = req.body;
  // Проверка присутствия параметра "id" в запросе.
  if (!id) {
    return res.status(400).json({ error: 'Параметр "id" отсутствует' });
  }

  // Поиск элемента в массиве 'items' по ID.
  const itemToUpdate = items.find((item) => item.id === id);
  // Проверка наличия элемента с указанным ID.
  if (!itemToUpdate) {
    return res
      .status(404)
      .json({ error: 'Элемент с указанным "id" не найден' });
  }

  // Присутствие в запросе параметра "text" => обновление текста элемента.
  if (text) {
    itemToUpdate.text = text;
  }

  // Присутствие в запросе параметра "completed" типа "boolean" => обновление статуса "completed".
  if (typeof completed === "boolean") {
    itemToUpdate.completed = completed;
  }

  // Отправка ответа в формате JSON (подтверждение обновления).
  res.json({ ok: true });
});

// Роут для удаления элемента.
app.delete("/api/v1/items", (req: Request, res: Response) => {
  // Извлечение параметра "id" из тела DELETE-запроса (в формате JSON).
  const { id } = req.body;
  // Проверка на присутствие параметра "id" в запросе.
  if (!id) {
    return res.status(400).json({ error: 'Параметр "id" отсутствует' });
  }

  // Поиск индекса элемента в массиве 'items' по ID.
  const itemIndex = items.findIndex((item) => item.id === id);
  // Проверка, найден ли элемент с указанным ID.
  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ error: 'Элемент с указанным "id" не найден' });
  }

  // Удаление элемента из массива 'items' по найденному индексу.
  items.splice(itemIndex, 1);
  res.json({ ok: true });
});

// Определение интерфейса для данных пользователя
interface User {
  login: string;
  pass: string;
}

// Настройка параметров для хранения сессий в файловой системе с использованием 'session-file-store'.
const FileStoreOptions = {};
const FileStoreInstance = FileStore(session);
app.use(
  session({
    secret: "mysecretkey", // Секретный ключ для подписи сессий.
    store: new FileStoreInstance(FileStoreOptions), // Используем FileStore для хранения сессий.
    resave: false, // Не сохранять сессию, если в нее ничего не записывалось.
    saveUninitialized: true, // Сохранять новые сессии, даже если они не были изменены.
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Продолжительность сессии в миллисекундах (тут 24 часа).
    },
  })
);

// Создание базы данных пользователей.
const users: User[] = [];

// Объявление модуля "express-session" с расширением интерфейса 'SessionData'.
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

// Роут для аутентификации (входа) пользователя.
app.post("/api/v1/login", (req, res) => {
  const { login, pass } = req.body;

  // Поиск пользователя с указанным логином и паролем.
  const user = users.find((u) => u.login === login && u.pass === pass);

  if (user) {
    // Если пользователь найден, сохраняем информацию о нем в сессии.
    req.session.user = user;

    res.json({ ok: true });
  } else {
    // Если пользователь не найден, возвращаем ошибку 401 (Unauthorized).
    res.status(401).json({ ok: false });
  }
});

// Роут для выхода пользователя (удаления сессии).
app.post("/api/v1/logout", (req, res) => {
  // Удаляем сессию пользователя.
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Роут для регистрации нового пользователя.
app.post("/api/v1/register", (req, res) => {
  const { login, pass } = req.body;
  // Добавление нового пользователя в имитацию базы данных (простейший пример).
  users.push({ login, pass });
  res.json({ ok: true });
});

// Запуск Express-сервера на указанном порту.
const server = app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});

export { app };
