import { Request, Response } from "express";
import { Item } from "./item.js";
import * as app from "./dataController.js";

/*
 Модуль обработки всех запросов.
*/

// Обработка запроса на получение списка задач текущего пользователя.
export async function getItems(req: Request, res: Response) {
  try {
    // Получение текущего пользователя из сессии.
    const currentUser = req.session.user;

    if (!currentUser) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    // Загрузка задач из базы данных(из файла хранения).
    const itemsDb = await app.loadItemsFromDb();
    // Список задач текущего пользователя или пустой массив, если у пользователя их нет.
    const userItems = itemsDb[currentUser.login] || [];

    res.json({ items: userItems });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling GET /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Обработка запроса на создание новой задачи текущего пользователя.
export async function createItem(req: Request, res: Response) {
  try {
    // Получение текущего пользователя из сессии.
    const currentUser = req.session.user;

    if (!currentUser) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    // Получение текста задачи из тела запроса.
    const { text } = req.body;

    if (!text) {
      // Если текст отсутствует или пуст => ошибка 400 (Bad Request).
      return res
        .status(400)
        .json({ error: 'Параметр "text" отсутствует или пуст' });
    }

    // Загрузка задач из базы данных (из файла хранения).
    const itemsDb = await app.loadItemsFromDb();
    // Извлечение списка задач текущего пользователя или [], если у пользователя их нет.
    const userItems = itemsDb[currentUser.login] || [];
    // Генерация уникального ID для новой задачи.
    const newId = await app.incrementNumberOfAllTasks();
    // Создание новой задачи.
    const newItem: Item = { id: newId, text, checked: false };
    // Ее добавление в список задач пользователя.
    userItems.push(newItem);

    // Сохранение обновленного списока задач в базу данных.
    itemsDb[currentUser.login] = userItems;
    await app.saveItemsToDb(itemsDb);

    // Отправка ID новой задачи в ответе.
    res.json({ id: newItem.id });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling POST /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Обработка запроса на обновление задачи текущего пользователя.
export async function updateItem(req: Request, res: Response) {
  try {
    // Получение текущего пользователя из сессии.
    const currentUser = req.session.user;

    if (!currentUser) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    // Извлечение параметров "id", "text" и "checked" из запроса.
    const { id, text, checked } = req.body;

    if (!id) {
      // Если параметр "id" отсутствует => ошибка 400 (Bad Request).
      return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }

    // Загрузка списка всех задач из файла хранения.
    const itemsDb = await app.loadItemsFromDb();
    // Получение списка задач текущего пользователя.
    const userItems = itemsDb[currentUser.login] || [];
    // Нахождение индекса задачи с указанным "id" в списке задач пользователя.
    const itemIndex = userItems.findIndex(
      (item: { id: any }) => item.id === id
    );

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
    await app.saveItemsToDb(itemsDb);
    
    res.json({ ok: true });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling PUT /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Обработка запроса на удаление задачи текущего пользователя.
export async function deleteItem(req: Request, res: Response) {
  try {
    const currentUser = req.session.user;

    if (!currentUser) {
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    // Извлечение параметра "id" из тела запроса.
    const { id } = req.body;

    if (!id) {
      // Если параметр "id" отсутствует => ошибка 400 (Bad Request).
      return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }

    // Загрузка задач из базы данных.
    const itemsDb = await app.loadItemsFromDb();
    // Получение списка задач текущего пользователя.
    const userItems = itemsDb[currentUser.login] || [];
    // Нахождение задачи с указанным "id" в списке задач пользователя.
    const itemIndex = userItems.findIndex(
      (item: { id: any }) => item.id === id
    );

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
    await app.saveItemsToDb(itemsDb);

    res.json({ ok: true });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling DELETE /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
