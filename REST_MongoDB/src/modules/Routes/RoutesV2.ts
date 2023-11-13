import express from "express";
import * as taskControllerLocal from "../localDB/taskController.js";
import * as userControllerLocal from "../localDB/userController.js";
import * as taskControllerMongo from "../mongoDB/taskController.js";
import * as userControllerMongo from "../mongoDB/userController.js";

/*
 A module with simplified routing logic for the second version of the application (api version: 'v2') with the database specified in the '.env' file. 
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

// Defining a handler for all HTTP methods that processes requests along the "/router" path.
router.all("/router", (req, res) => {
  // Extracting "action" from a query string.
  const action = req.query.action;
  // If the "action" parameter is missing => error '400'.
  if (!action) {
    return res.status(400).json({ error: "Missing 'action' parameter!" });
  }

  // Depending on the 'action' value, the desired controller is called with the appropriate request.
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
      // If the "action" parameter has an invalid value => error '400'.
      res.status(400).json({ error: "Invalid 'action' parameter!" });
  }
});

export default router;
