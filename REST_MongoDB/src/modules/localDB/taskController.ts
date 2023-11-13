import { Request, Response } from "express";
import { Item } from "./item.js";
import * as app from "./dataController.js";

/*
 Module for processing all requests.
*/

// Processing a request to obtain a list of tasks for the current user.
export async function getItems(req: Request, res: Response) {
  try {
    // Getting the current user from the session.
    const currentUser = req.session.user;

    if (!currentUser) {
      // If the user is not authenticated => 401 error.
      return res.status(401).json({ error: "User is not authenticated" });
    }

    // Loading tasks from the database (from a storage file).
    const itemsDb = await app.loadItemsFromDb();
    // A list of tasks for the current user, or an empty array if the user does not have any.
    const userItems = itemsDb[currentUser.login] || [];

    res.json({ items: userItems });
  } catch (error) {
    // Handling server errors.
    console.error("Error while handling GET /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Processing a request to create a new task for the current user.
export async function createItem(req: Request, res: Response) {
  try {
    // Getting the current user from the session.
    const currentUser = req.session.user;

    if (!currentUser) {
      // If the user is not authenticated => 401 error.
      return res.status(401).json({ error: "User is not authenticated" });
    }

    // Retrieving the task text from the request body.
    const { text } = req.body;

    if (!text) {
      // If the text is missing or empty => error 400 (Bad Request).
      return res
        .status(400)
        .json({ error: 'The "text" parameter is missing or empty' });
    }

    // Loading tasks from the database being used (from a storage file).
    const itemsDb = await app.loadItemsFromDb();
    // Retrieves the current user's list of tasks, or [] if the user doesn't have any.
    const userItems = itemsDb[currentUser.login] || [];
    // Generating a unique ID for a new task.
    const newId = await app.incrementNumberOfAllTasks();
    // Create a new task.
    const newItem: Item = { id: newId, text, checked: false };
    // Adding it to the user's task list.
    userItems.push(newItem);

    // Saving the updated task list to the database.
    itemsDb[currentUser.login] = userItems;
    await app.saveItemsToDb(itemsDb);

    // Sending the 'id' of the new task in the response.
    res.json({ id: newItem.id });
  } catch (error) {
    // Handling server errors.
    console.error("Error while handling POST /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Processing a request to update a task for the current user.
export async function updateItem(req: Request, res: Response) {
  try {
    // Getting the current user from the session.
    const currentUser = req.session.user;

    if (!currentUser) {
      // If the user is not authenticated => 401 error.
      return res.status(401).json({ error: "User is not authenticated" });
    }

    // Extracting the "id", "text" and "checked" parameters from the request.
    const { id, text, checked } = req.body;

    if (!id) {
      // If the "id" parameter is missing => error 400 (Bad Request).
      return res.status(400).json({ error: 'The "id" parameter is missing' });
    }

    // Loading a list of all tasks from a storage file.
    const itemsDb = await app.loadItemsFromDb();
    // Retrieving a list of tasks for the current user.
    const userItems = itemsDb[currentUser.login] || [];
    // Finding the index of a task with the specified "id" in the user's task list.
    const itemIndex = userItems.findIndex(
      (item: { id: any }) => item.id === id
    );

    if (itemIndex === -1) {
      // If a task with the specified "id" is not found => error 404 (Not Found).
      return res
        .status(404)
        .json({ error: 'The element with the specified "id" was not found' });
    }

    if (text) {
      // If the 'text' parameter is set => updating the task text.
      userItems[itemIndex].text = text;
    }

    // Update 'checked' parameter.
    userItems[itemIndex].checked = checked;

    // Saving the updated task list in the database.
    itemsDb[currentUser.login] = userItems;
    await app.saveItemsToDb(itemsDb);

    res.json({ ok: true });
  } catch (error) {
    // Handling server errors.
    console.error("Error while handling PUT /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Process a request to delete a specific task of the current user.
export async function deleteItem(req: Request, res: Response) {
  try {
    const currentUser = req.session.user;
    // If the user is not authenticated => 401 error.
    if (!currentUser) {
      return res.status(401).json({ error: "User is not authenticated" });
    }

    // Extracting the "id" parameter from the request body.
    const { id } = req.body;

    if (!id) {
      // If the "id" parameter is missing => error 400 (Bad Request).
      return res.status(400).json({ error: 'The "id" parameter is missing' });
    }

    // Loading tasks from the database.
    const itemsDb = await app.loadItemsFromDb();
    // Retrieving a list of tasks for the current user.
    const userItems = itemsDb[currentUser.login] || [];
    // Finding a task with the specified "id" in the user's task list.
    const itemIndex = userItems.findIndex(
      (item: { id: any }) => item.id === id
    );

    if (itemIndex === -1) {
      // If a task with the specified "id" is not found => error 404 (Not Found).
      return res
        .status(404)
        .json({ error: 'The element with the specified "id" was not found' });
    }

    // Removing a task with a found "id" from the user's task list.
    userItems.splice(itemIndex, 1);
    // Update the database with an updated list of tasks.
    itemsDb[currentUser.login] = userItems;
    await app.saveItemsToDb(itemsDb);

    res.json({ ok: true });
  } catch (error) {
    // Handling server errors.
    console.error("Error while handling DELETE /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
