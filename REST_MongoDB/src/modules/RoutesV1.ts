import express from "express";
import * as taskController from "./taskController.js";
import * as userController from "./userController.js";

/*
 Роуты для первого варианта работы приложения (версия api: 'v1'). 
*/

// Создание экземпляра маршрутизатора для Express.
const router = express.Router();

router.get("/items", taskController.getItems);
router.post("/items", taskController.createItem);
router.put("/items", taskController.updateItem);
router.delete("/items", taskController.deleteItem);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);

// Экспорт маршрутизатора.
export default router;
