import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import session from "express-session";
import FileStore from "session-file-store";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { User } from './modules/user.js'
import { Item } from "./modules/item.js";

// Определение пути к текущему файлу и его директории.
const currentFile = fileURLToPath(import.meta.url);
// Путь текущего каталога.
const currentDir = path.dirname(currentFile);
// Путь родительского каталога.
const parentDir = path.dirname(currentDir);
// Путь к файлу со всеми задачами, написанными пользователями.
const numberOfAllTasksFileDir = path.dirname(currentDir) + "/numberOfAllTask.json";
// // Генерация уникального ID для новой добавляемой задачи.
// const unicID = generateUniqueID();
// console.log(`unicID: ${unicID}`);

// Создание Express-приложения.
const app = express();
// Приложение будет использовать JSON-парсер для обработки JSON-запросов.
app.use(express.json())
// Используется значение из переменной окружения PORT, либо 3005.
const port = process.env.PORT || 3005;

// Настройка параметров для хранения сессий в файловой системе с использованием 'session-file-store'.
const FileStoreOptions = {};
const FileStoreInstance = FileStore(session);
app.use(
  session({
    secret: "my_usual_lightweight_secret_key",
    store: new FileStoreInstance(FileStoreOptions),
    resave: true, // Не сохранять сессию, если в нее ничего не записывалось.
    saveUninitialized: true, // Сохранять новые сессии, даже если они не были изменены.
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Объявление модуля "express-session" с расширением интерфейса 'SessionData'.
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

// Обработка запроса для получения страницы клиента.
app.use("/client", (req, res) => {
  res.sendFile(path.resolve(currentDir, "../client/index.html"));
});

app.use(bodyParser.json());

// Роут для получения списка задач текущего пользователя.
app.get('/api/v1/items', async (req: Request, res: Response) => {
  try {
    // Получение текущего пользователя из сессии.
    const currentUser = req.session.user;

    if (!currentUser) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }

    // Загрузка задач из базы данных(из файла хранения).
    const itemsDb = await loadItemsFromDb();
    // Список задач текущего пользователя или пустой массив, если у пользователя их нет.
    const userItems = itemsDb[currentUser.login] || [];

    res.json({ items: userItems });
  } catch (error) {
    // Обработка ошибок сервера
    console.error("Error while handling GET /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для создания новой задачи текущего пользователя.
app.post('/api/v1/items', async (req: Request, res: Response) => {
  try {
    // Получение текущего пользователя из сессии.
    const currentUser = req.session.user;

    if (!currentUser) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }

    // Получение текста задачи из тела запроса.
    const { text } = req.body;

    if (!text) {
      // Если текст отсутствует или пуст => ошибка 400 (Bad Request).
      return res
        .status(400)
        .json({ error: 'Параметр "text" отсутствует или пуст' });
    }

    // Загрузка задач из базы данных(из файла хранения).
    const itemsDb = await loadItemsFromDb();
    // Извлечение списка задач текущего пользователя или [], если у пользователя их нет.
    const userItems = itemsDb[currentUser.login] || [];

    // Генерация уникального ID для новой задачи.
    const newId = await incrementNumberOfAllTasks();
  
    // Создание новой задачи.
    const newItem: Item = { id: newId, text, checked: false };
    //const newItem: Item = { id: lastItemId + 1, text, checked: false };
    // Ее добавление в список задач пользователя.
    userItems.push(newItem);
    // Сохранение обновленного списока задач в базу данных.
    itemsDb[currentUser.login] = userItems;
    await saveItemsToDb(itemsDb);
    // Отправка ID новой задачи в ответе.
    res.json({ id: newItem.id });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling POST /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для обновления задачи текущего пользователя.
app.put('/api/v1/items', async (req: Request, res: Response) => {
  try {
    // Получение текущего пользователя из сессии.
    const currentUser = req.session.user;

    if (!currentUser) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }
    // Извлечение параметров "id", "text" и "checked" из запроса.
    const { id, text, checked } = req.body;

    if (!id) {
      // Если параметр "id" отсутствует => ошибка 400 (Bad Request).
      return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }
    // Получение списка задач текущего пользователя.
    const itemsDb = await loadItemsFromDb();
    const userItems = itemsDb[currentUser.login] || [];
    // Нахождение индекса задачи с указанным "id" в списке задач пользователя.
    const itemIndex = userItems.findIndex((item: { id: any }) => item.id === id);

    if (itemIndex === -1) {
      // Если задача с указанным "id" не найдена => ошибка 404 (Not Found).
      return res
        .status(404)
        .json({ error: 'Элемент с указанным "id" не найден' });
    }

    if (text) {
      // Если задан параметр "text" => обновление текста задачи.
      userItems[itemIndex].text = text;
    }

    if (typeof checked === "boolean") {
      // Если задан параметр "checked" как булево значение => обновление его.
      userItems[itemIndex].checked = checked;
    }

    // Сохранение обновленного списка задач в базе данных.
    itemsDb[currentUser.login] = userItems;
    await saveItemsToDb(itemsDb);
    res.json({ ok: true });
  } catch (error) {
    // Обработка ошибок сервера
    console.error("Error while handling PUT /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для удаления задачи текущего пользователя.
app.delete('/api/v1/items', async (req: Request, res: Response) => {
  try {
    const currentUser = req.session.user;

    if (!currentUser) {
      return res.status(401).json({ error: "Пользователь не аутентифицирован" });
    }

    // Извлечение параметра "id" из тела запроса.
    const { id } = req.body;

    if (!id) {
      // Если параметр "id" отсутствует => ошибка 400 (Bad Request).
      return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }

    // Загрузка задач из базы данных.
    const itemsDb = await loadItemsFromDb();
    // Получение списка задач текущего пользователя.
    const userItems = itemsDb[currentUser.login] || [];
    // Нахождение индекса задачи с указанным "id" в списке задач пользователя.
    const itemIndex = userItems.findIndex((item: { id: any }) => item.id === id);

    if (itemIndex === -1) {
      // Если задача с указанным "id" не найдена => ошибка 404 (Not Found).
      return res
        .status(404)
        .json({ error: 'Элемент с указанным "id" не найден' });
    }

    // Удаление задачи с найденным "id" из списка задач пользователя.
    userItems.splice(itemIndex, 1);
    // Обновление базы данных с обновленным списком задач.
    itemsDb[currentUser.login] = userItems;
    await saveItemsToDb(itemsDb);

    res.json({ ok: true });
  } catch (error) {
    // Обработка ошибок сервера
    console.error("Error while handling DELETE /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для аутентификации (входа) пользователя.
app.post("/api/v1/login", async (req: Request, res: Response) => {
  try {
    const { login, pass } = req.body;

    // Поиск пользователя  с указанным логином и паролем в файле dbItems.json.
    const user = await findUserInDb(login, pass);

    if (user) {
      // Если пользователь найден => выполняется аутентификация.
      req.session.regenerate((error) => {
        if (error) {
          // Обработка ошибки при сессионной регенерации, если она произошла.
          console.log(`${error}`);
          return;
        }
        // Если пользователь найден, сохраняем информацию о нем в сессии.
        req.session.user = user;
        // Сохранение сессии в хранилище.
        req.session.save((err) => {
          // Обработка ошибки при сохранении сессии, если она произошла.
          console.log(`${err}`);
          res.json({ ok: true });
        });
      });
    } else {
      // Если пользователь не найден => 401 (Unauthorized).
      res.status(401).json({ ok: false });
    }
  } catch (error) {
    // Обработка ошибок сервера
    console.error("Error while handling POST /api/v1/login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для выхода пользователя (удаления сессии).
app.post("/api/v1/logout", (req: Request, res: Response) => {
  // Удаляем сессию пользователя.
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Роут для регистрации нового пользователя.
app.post('/api/v1/register', async (req, res) => {
  try {
    const { login, pass } = req.body;

    // Проверка на наличие обязательных полей логина и пароля.
    if (!login || !pass) {
      return res.status(400).json({ error: "Логин и пароль обязательны" });
    }

    // Загрузка пользователей из базы данных.
    const users = await loadUsersFromDb();

    // Проверка, существует ли пользователь с таким логином.
    const existingUser = users.find((user: any) => user.login === login);
    if (existingUser) {
      // Если пользователь с таким логином уже существует, возвращаем ошибку.
      return res
        .status(400)
        .json({ error: "Пользователь с таким логином уже существует" });
    }

    // Регистрация нового пользователя (запись в файл для хранения).
    await registerUser(login, pass);

    res.json({ ok: true });
  } catch (error) {
    // Обработка ошибок сервера
    console.error("Error while handling POST /api/v1/register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Функция для загрузки пользователей из файла dbUsers.json.
async function loadUsersFromDb() {
  const dbFilePath = path.resolve(currentDir, "../dbUsers.json");
  try {
    const dbData = await fs.promises.readFile(dbFilePath, 'utf-8');
    return JSON.parse(dbData);
  } catch (error) {
    // Если произошла ошибка при чтении файла => возвращается пустой массив.
    return [];
  }
}

// Функция для поиска пользователя по логину и паролю в файле dbUsers.json.
async function findUserInDb(login: string, pass: string) {
  try {
    const users = await loadUsersFromDb();
    console.dir(`283 findUserInDb(): ${JSON.stringify(users)}`); /////////////////////
    return users.find(
      (user: any) => user.login === login && user.pass === pass
    );
  } catch (error) {
    // Обработка ошибки чтения из базы данных
    console.error("Error while reading users from the database:", error);
    return null; // Вернуть null или другое значение, которое указывает на ошибку
  }
}

// Функция для сохранения пользователей в файл 'dbUsers.json'.
async function saveUsersToDb(users: string) {
  // Преобразование в формат JSON с отступами для удобного чтения.
  const data = JSON.stringify(users, null, 2);
  await fs.promises.writeFile("dbUsers.json", data, "utf8");
}

// Функция для регистрации нового пользователя.
async function registerUser(login: string, pass: string) {
  const users = await loadUsersFromDb();
  users.push({ login, pass });
  await saveUsersToDb(users);
}

// Функция для загрузки всех задач из файла dbItems.json.
async function loadItemsFromDb() {
  // Получение адреса общего файла со всеми тасками всех юзеров.
  const dbFilePath = path.resolve(parentDir, "dbItems.json");
  try {
    const dbData = await fs.promises.readFile(dbFilePath, "utf-8");
    return JSON.parse(dbData);
  } catch (error) {
    // Если произошла ошибка при чтении файла или файл не существует => пустой объект.
    // (обработка данной ошибки - в месте вызова функции)
    return {};
  }
}

// Функция для сохранения всех задач в файл dbItems.json.
async function saveItemsToDb(items: Record<string, Item[]>) {
  const dbFilePath = path.resolve(parentDir, "dbItems.json");
  const data = JSON.stringify(items, null, 2);
  await fs.promises.writeFile(dbFilePath, data, 'utf8');
}

// Функция для чтения текущего значения ID из файла
async function readNumberOfAllTasks() {
  try {
    const data = await fs.promises.readFile(numberOfAllTasksFileDir, "utf-8");
    return parseInt(data, 10); // Преобразовывание к числу.
  } catch (error) {
    console.error('Ошибка чтения файла numberOfAllTasks.json', error);
    return 0; // по умолчанию.
  }
}

// Функция для увеличения значения ID и записи его в файл.
async function incrementNumberOfAllTasks() {
  const currentNumber = await readNumberOfAllTasks();
  const newNumber = currentNumber + 1;
  try {
    await fs.promises.writeFile(numberOfAllTasksFileDir, newNumber.toString(), 'utf-8');
  } catch (error) {
    console.error('Ошибка записи в numberOfAllTasks.json', error);
  }
  return newNumber;
}

// Запуск Express-сервера на указанном порту.
const server = app.listen(port, () => {
  console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
