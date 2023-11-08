import { Request, Response } from "express";
import * as app from "./dataController.js";

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

    // Список задач текущего пользователя.
    const userItems = await app.loadItemsFromDb(currentUser);

    res.json({ items: userItems });
  } catch (error) {
    // Обработка ошибок сервера.
    console.error("Error while handling GET /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
