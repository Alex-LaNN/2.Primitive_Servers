//import { Request, Response } from "express";
import User from "../models/item.js";

// Функция для загрузки пользователей из 'MongoDB'.
export async function loadUsersFromDb() {}

// Функция для поиска пользователя по логину и паролю в 'MongoDB'.
export async function findUserInDb(login: string, pass: string) {}

// Функция для сохранения пользователей в 'MongoDB'.
export async function saveUsersToDb(users: string) {}

// Функция для регистрации нового пользователя.
export async function registerUser(login: string, pass: string) {
  try {
    // Создаем нового пользователя
    const newUser = new User({
      login,
      pass,
      todos: [],
    });

    // Сохраняем пользователя в 'MongoDB'.
    const savedUser = await newUser.save();
    console.dir(`26 (mongoDB.dataController): ${savedUser}`);

    // Возвращаем сохраненного пользователя.
    return savedUser;
  } catch (error) {
    // Обработка ошибок, например, дублирование логина и другие
    throw new Error(`Failed to register user: ${error}`);
  }
}

// Функция для загрузки всех задач из 'MongoDB'.
export async function loadItemsFromDb(user: any) {
  try {
    const foundUser = await User.findById(user._id);

    if (!foundUser) {
      throw new Error("User not found");
    }

    return foundUser.todos;
  } catch (error) {
    throw new Error(`Failed to load items from the database: ${error}`);
  }
}

// Функция для сохранения всех задач в 'MongoDB'.
//export async function saveItemsToDb(items: Record<string, Item[]>) { }
