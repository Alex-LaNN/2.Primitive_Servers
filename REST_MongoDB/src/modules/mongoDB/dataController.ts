import mongoose from "mongoose";
import { models } from "../models/item.js";

// Получение значений из импорта.
const { User } = models;

// Функция для регистрации нового пользователя.
export async function registerUser(login: string, pass: string) {
  try {
    // Создание нового пользователя.
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      login,
      pass,
      todos: [],
    });

    // Сохранение пользователя в 'MongoDB'.
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    // Обработка ошибок.
    throw new Error(`Failed to register user: ${error}`);
  }
}

// Функция для загрузки всех задач данного пользователя из 'MongoDB'.
export async function loadItemsFromDb(user: any) {
  try {
    // Получение пользователя по его 'id'.
    const foundUser = await User.findById(user._id);

    if (!foundUser) {
      throw new Error("User not found");
    }

    return foundUser.todos;
  } catch (error) {
    throw new Error(`Failed to load items from the database: ${error}`);
  }
}
