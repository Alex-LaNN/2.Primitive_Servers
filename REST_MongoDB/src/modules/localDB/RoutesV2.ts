import express from "express";
import * as taskController from "./taskController.js";
import * as userController from "./userController.js";

/*
 Модуль с переделанной логикой маршрутизации для второго варианта работы 
 приложения (версия api: 'v2') с локальной БД. 
*/

// Создание экземпляра маршрутизатора для Express.
const router = express.Router();

// Определение обработчика для всех HTTP-методов, обрабатывающего запросы по пути "/router".
router.all("/router", (req, res) => {
  // Извлечение "action" из строки запроса.
  const action = req.query.action;
  console.log(`10 action: ${action}`);
  // Если параметр "action" отсутствует => ошибка '400'.
  if (!action) {
    return res.status(400).json({ error: "Missing 'action' parameter" });
  }

  // В зависимости от значения "action", вызывается нужный контроллер с соответствующим запросом.
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
