import { Request, Response } from "express";
import * as app from "./dataController.js";
import { models } from "../models/item.js";
import bcrypt from "bcryptjs";

/*
 Модуль логики работы с пользователем.
*/

// Получение значений из импорта.
const { User } = models;

// Обработка запроса для регистрации нового пользователя.
export const register = async (req: Request, res: Response) => {
  try {
    const { login, pass } = req.body;

    // Проверка на наличие обязательных полей логина и пароля.
    if (!login || !pass) {
      return res.status(400).json({ error: "Логин и пароль обязательны" });
    }

    // Проверка, существует ли пользователь с таким логином.
    const user = await User.findOne({ login });

    if (user) {
      // Если пользователь с таким логином уже существует => ошибка '400'.
      return res
        .status(400)
        .json({ error: "Пользователь с таким логином уже существует" });
    }

    // Регистрация нового пользователя с записью в БД.
    await app.registerUser(login, pass);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error while handling 'register':", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Обработка запроса для аутентификации (входа) пользователя.
export const login = async (req: Request, res: Response) => {
  try {
    const { login } = req.body;

    // Поиск пользователя  с указанным логином в DB.
    const user = await User.findOne({ login });

    if (user) {// && 
      // Если пользователь найден => выполняется аутентификация.
      req.session.user = user;
      
      res.send(JSON.stringify({ ok: true }));
    } else {
      // Если пользователь не найден => ошибка '401' (Unauthorized).
      res.status(401).json({ ok: false });
    }
  } catch (error) {
    console.error("Error while handling 'login':", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Обработка запроса для выхода пользователя.
export const logout = (req: Request, res: Response) => {
  // Удаление сессии пользователя.
  req.session.destroy(() => {
    res.json({ ok: true });
  });
};

// Получение значения Id текущего пользователя.
export async function getId(req: Request, res: Response) {
  // Получение текущего пользователя из сессии.
  const currentUser = req.session.user;
  const login = currentUser?.login;

  // Поиск пользователя  с указанным логином в DB.
  const user = await User.findOne({ login });
  //console.dir(`85 (mongoDB.userController) user: ${user}`);
  const userId = user?._id;
  //console.log(`87 uC mDB userId: ${userId}`);
  return userId
}
