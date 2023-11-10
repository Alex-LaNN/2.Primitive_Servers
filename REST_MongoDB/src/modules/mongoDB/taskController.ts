import mongoose from "mongoose";
import { Request, Response } from "express";
import * as app from "./dataController.js";
import * as getUser from "./userController.js"
import { models } from "../models/item.js";

// Получение значений из импорта.
const { User } = models;

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

    // Получение списка задач текущего пользователя из БД.
    const userItems = await app.loadItemsFromDb(currentUser);
    const resItems = userItems.map((item: any) => {
      return { id: item._id, text: item.text, checked: item.checked };
    })

    res.json({ items: resItems });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling GET /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Обработка запроса на создание новой задачи текущего пользователя.
export async function createItem(req: Request, res: Response) {
  try {
    // Получение значения Id текущего пользователя.
    const userId = await getUser.getId(req, res);

    if (!req.session.user || undefined) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    // Получение текста задачи из тела запроса.
    const { text } = req.body;

    if (!text) {
      // Если текст отсутствует => ошибка 400 (Bad Request).
      return res
        .status(400)
        .json({ error: 'Параметр "text" отсутствует или пуст' });
    }

    // Создание новой задачи.
    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      text,
      checked: false,
    };

    // Добавление новой задачи в массив 'todos' текущего пользователя.
    await User.updateOne({ _id: userId }, { $push: { todos: newItem } });

    // Отправка ID новой задачи в ответе.
    res.json({ id: newItem._id });
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
    // Получение значения Id текущего пользователя.
    const userId = await getUser.getId(req, res);

    if (!currentUser) {
      // Если пользователь не аутентифицирован => ошибка 401.
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    // Извлечение параметров 'id', 'text' и 'checked' из запроса.
    const { id, text, checked } = req.body;

    // Получение списка задач текущего пользователя из БД.
    const userTodos = (await app.loadItemsFromDb(currentUser)) || [];
    // Нахождение 'id' задачи в списке задач пользователя.
    const itemIndex = userTodos.findIndex(
      (todo: { _id: mongoose.Types.ObjectId }) => todo._id.toString() === id
    );
    if (itemIndex === -1) {
      // Если задача с указанным 'id' не найдена => ошибка 404 (Not Found).
      return res
        .status(404)
        .json({ error: 'Элемент с указанным "id" не найден' });
    }

    // Получение задачи для редактирования из списка задач текущего пользователя.
    const todo = userTodos[itemIndex];

    if (text) {
      // Если в запросе присутствует параметр 'text' => обновление текста задачи.
      todo.text = text;
    }

    // Обновление параметра 'checked'.
    todo.checked = checked;

    //Сохранение обновленного списка задач текущего пользователя в БД.
    await User.updateOne(
      { _id: userId, "todos._id": id },
      {
        $set: {
          "todos.$.text": todo.text,
          "todos.$.checked": todo.checked,
        },
      }
    );

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
    // Получение текущего пользователя из сессии.
    const currentUser = req.session.user;

    if (!currentUser) {
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    // Получение значения 'id' текущего пользователя.
    const userId = await getUser.getId(req, res);

    // Извлечение параметра 'id' удаляемой задачи из тела запроса.
    const { id } = req.body;

    if (!id) {
      // Если параметр 'id' отсутствует => ошибка 400 (Bad Request).
      return res.status(400).json({ error: 'Параметр "id" (удаляемой задачи) отсутствует' });
    }

    // Удаление задачи с найденным 'id' из списка задач пользователя.
    await User.updateOne({ _id: userId }, { $pull: { todos: { _id: id } } });

    res.json({ ok: true });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling DELETE /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
 }