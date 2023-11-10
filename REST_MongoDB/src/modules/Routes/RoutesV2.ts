import express from "express";
import * as taskControllerLocal from "../localDB/taskController.js";
import * as userControllerLocal from "../localDB/userController.js";
import * as taskControllerMongo from "../mongoDB/taskController.js";
import * as userControllerMongo from "../mongoDB/userController.js";

/*
 Модуль с переделанной логикой маршрутизации для второго варианта работы 
 приложения (версия api: 'v2') с БД, указанной в файле .env. 
*/

// Определение типа базы данных из переменной окружения.
const dbType: string | any = process.env.DB_TYPE;
console.dir(`14 dbType: ${dbType}`);

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

// Определение обработчика для всех HTTP-методов, обрабатывающего запросы по пути "/router".
router.all("/router", (req, res) => {
  // Извлечение "action" из строки запроса.
  const action = req.query.action;
  // Если параметр "action" отсутствует => ошибка '400'.
  if (!action) {
    return res.status(400).json({ error: "Missing 'action' parameter" });
  }

  // В зависимости от значения 'action', вызывается нужный контроллер с соответствующим запросом.
  switch (action) {
    case "login":
      userController.login(req, res);
      break;
    case "logout":
      userController.logout(req, res);
      break;
    case "register":
      userController.register(req, res);
      break;
    case "getItems":
      taskController.getItems(req, res);
      break;
    case "deleteItem":
      taskController.deleteItem(req, res);
      break;
    case "addItem":
      taskController.createItem(req, res);
      break;
    case "editItem":
      taskController.updateItem(req, res);
      break;
    default:
      // Если параметр "action" имеет недопустимое значение => ошибка '400'.
      res.status(400).json({ error: "Invalid 'action' parameter" });
  }
});

// Экспорт маршрутизатора.
export default router;
