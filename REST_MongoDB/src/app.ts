import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import path from "path";

// Определение пути к текущему файлу и его директории.
const currentFile = __filename;
const currentDir = path.dirname(currentFile);

// Создание Express-приложения.
const app = express();
// Приложение будет использовать JSON-парсер для обработки JSON-запросов.
app.use(express.json())
// Используется значение из переменной окружения PORT, либо 3005.
const port = process.env.PORT || 3005;

// Обработка запроса для получения страницы клиента.
app.use("/client", (req, res) => {
  res.sendFile(path.resolve(currentDir, "../client/index.html"));
});

app.use(bodyParser.json());

// Для хранения ID последнего элемента.
let lastItemId: number = 0;

// Интерфейс массива элементов с полями id, text и checked.
interface Item {
  id: number;
  text: string;
  checked: boolean;
}

// Создание массива элементов.
const items: Item[] = [];

// Роут для получения списка элементов.
app.get("/api/v1/items", (req: Request, res: Response) => {
  const itemsResponse = items.map((item) => ({
    id: item.id,
    text: item.text,
    checked: item.checked,
  }));
  res.json({ items: itemsResponse });
});

// Роут для создания нового элемента.
app.post("/api/v1/items", (req: Request, res: Response) => {
  const { text } = req.body;

  if (text) {
    // Увеличение ID.
    lastItemId++;
    // По умолчанию "checked" равно false (когда задача не выполнена еще).
    const newItem: Item = { id: lastItemId, text, checked: false };
    // Добавление новой задачи в общий список заметок.
    items.push(newItem);
    // Возвращение 'id' добавленной новой задачи.
    res.json({ id: lastItemId });
  } else {
    res.status(400).json({ error: 'Параметр "text" отсутствует или пуст' });
  }
});

// Роут для обновления элемента.
app.put('/api/v1/items', (req: Request, res: Response) => {
  // Извлечение параметров запроса (ID, текст и статус "checked") из тела запроса (в формате JSON).
  const { id, text, checked } = req.body;
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

  // Присутствие в запросе параметра "checked" типа "boolean" => обновление статуса "checked".
  if (typeof checked === "boolean") {
    itemToUpdate.checked = checked;
  }

  // Отправка ответа в формате JSON (подтверждение обновления).
  res.json({ ok: true });
});

// Роут для удаления элемента.
app.delete('/api/v1/items', (req: Request, res: Response) => {
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

// Запуск Express-сервера на указанном порту.
const server = app.listen(port, () => {
  console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
