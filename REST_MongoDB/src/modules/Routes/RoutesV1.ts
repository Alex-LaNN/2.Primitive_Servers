import express from "express";
import * as taskControllerLocal from "../localDB/taskController.js";
import * as userControllerLocal from "../localDB/userController.js";
import * as taskControllerMongo from "../mongoDB/taskController.js";
import * as userControllerMongo from "../mongoDB/userController.js";

/*
 Роуты для первого варианта работы приложения (версия api: 'v1') с БД, указанной в файле .env. 
*/

// Определение типа базы данных из переменной окружения.
const dbType: string | any = process.env.DB_TYPE;

// Создание экземпляра маршрутизатора для Express.
const router = express.Router();

// Функция для выбора контроллеров в зависимости от значения 'DB_TYPE'.
const getControllers = (dbType: string) => {
  switch (dbType) {
    case "local":
      return { taskController: taskControllerLocal, userController: userControllerLocal };
    case "mongo":
      return { taskController: taskControllerMongo, userController: userControllerMongo };
    default:
      throw new Error("Invalid DB_TYPE value");
  }
};

// Получение контроллеров в зависимости от значения 'DB_TYPE'.
const { taskController, userController } = getControllers(dbType);

router.get("/items", taskController.getItems);
router.post("/items", taskController.createItem);
router.put("/items", taskController.updateItem);
router.delete("/items", taskController.deleteItem);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);

// Экспорт маршрутизатора.
export default router;
