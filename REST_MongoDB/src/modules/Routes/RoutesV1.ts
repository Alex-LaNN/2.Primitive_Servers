import express from "express";
import * as taskControllerLocal from "../localDB/taskController.js";
import * as userControllerLocal from "../localDB/userController.js";
import * as taskControllerMongo from "../mongoDB/taskController.js";
import * as userControllerMongo from "../mongoDB/userController.js";

/*
 Routes for the first version of the application (api version: 'v1') with the database specified in the '.env' file. 
*/

// Determining the database type from an environment variable.
const dbType: string | any = process.env.DB_TYPE;

// Create a router instance for Express.
const router = express.Router();

// Function for selecting controllers depending on the 'DB_TYPE' value.
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

// Getting controllers depending on the 'DB_TYPE' value.
const { taskController, userController } = getControllers(dbType);

// Setting routes for various operations in the application.
router.get("/items", taskController.getItems);
router.post("/items", taskController.createItem);
router.put("/items", taskController.updateItem);
router.delete("/items", taskController.deleteItem);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);

export default router;
