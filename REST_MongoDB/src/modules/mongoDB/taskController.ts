import mongoose from "mongoose";
import { Request, Response } from "express";
import * as getUser from "./userController.js"
import { models } from "../models/item.js";

/**
 * A module responsible for the operation of the application with user tasks.
 */

// Getting the 'User' value from the import.
const { User } = models;

// Processing a request to obtain a list of tasks for the current user.
export async function getItems(req: Request, res: Response) {
  try {
    // Getting the current user from the session.
    const currentUser = req.session.user;

    if (!currentUser) {
      // If the user is not authenticated => 401 error.
      return res.status(401).json({ error: "User is not authenticated!" });
    }

    // Retrieving a list of tasks for the current user from the database.
    const userItems = await loadItemsFromDb(currentUser);
    // Bringing fields from the database into line with the values of the front fields ('_id' => 'id').
    const resItems = userItems.map((item: any) => {
      return { id: item._id, text: item.text, checked: item.checked };
    });

    res.json({ items: resItems });
  } catch (error) {
    // Handling server errors.
    console.error("Error while handling GET /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Processing a request to create a new task for the current user.
export async function createItem(req: Request, res: Response) {
  try {
    // Getting the 'id' value of the current user.
    const userId = await getUser.getId(req, res);

    if (!req.session.user || undefined) {
      // If the user is not authenticated => 401 error.
      return res.status(401).json({ error: "User is not authenticated!" });
    }

    // Retrieving the task text from the request body.
    const { text } = req.body;

    if (!text) {
      // If there is no text => error 400 (Bad Request).
      return res
        .status(400)
        .json({ error: 'The "text" parameter is missing or empty!' });
    }

    // Create a new task.
    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      text,
      checked: false,
    };

    // Adding a new task to the current user's 'todos' array.
    await User.updateOne({ _id: userId }, { $push: { todos: newItem } });

    // Sending the new task 'id' in the response.
    res.json({ id: newItem._id });
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
    // Getting the 'id' value of the current user.
    const userId = await getUser.getId(req, res);

    if (!currentUser) {
      // If the user is not authenticated => 401 error.
      return res.status(401).json({ error: "User is not authenticated!" });
    }

    // Extracting the 'id', 'text' and 'checked' parameters from the request body.
    const { id, text, checked } = req.body;

    // Retrieving a list of tasks for the current user from the database.
    const userTodos = (await loadItemsFromDb(currentUser)) || [];
    // Finding the task 'id' in the user's task list.
    const itemIndex = userTodos.findIndex(
      (todo: { _id: mongoose.Types.ObjectId }) => todo._id.toString() === id
    );
    if (itemIndex === -1) {
      // If a task with the specified 'id' is not found => error 404 (Not Found).
      return res
        .status(404)
        .json({ error: 'The element with the specified "id" was not found!' });
    }

    // Getting a task to edit from the current user's task list.
    const todo = userTodos[itemIndex];

    if (text) {
      // If the request contains the 'text' parameter => updating the task text.
      todo.text = text;
    }

    // Update 'checked' parameter.
    todo.checked = checked;

    // Saving the updated list of tasks of the current user in the database.
    await User.updateOne(
      { _id: userId, "todos._id": id },
      {
        $set: {
          "todos.$.text": todo.text,
          "todos.$.checked": todo.checked,
        },
      }
    );

    res.json({ ok: true });
  } catch (error) {
    // Handling server errors.
    console.error("Error while handling PUT /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Processing a request to delete a task for the current user.
export async function deleteItem(req: Request, res: Response) { 
  try {
    // Getting the current user from the session.
    const currentUser = req.session.user;

    if (!currentUser) {
      // If the user is not authenticated => 401 error.
      return res.status(401).json({ error: "User is not authenticated!" });
    }

    // Getting the 'id' value of the current user.
    const userId = await getUser.getId(req, res);

    // Extracting the 'id' parameter of the task to be deleted from the request body.
    const { id } = req.body;

    if (!id) {
      // If the 'id' parameter is missing => error 400 (Bad Request).
      return res.status(400).json({
        error: 'The "id" parameter (of the task to be deleted) is missing!',
      });
    }

    // Removing a task with the found 'id' from the user's task list.
    await User.updateOne({ _id: userId }, { $pull: { todos: { _id: id } } });

    res.json({ ok: true });
  } catch (error) {
    // Handling server errors.
    console.error("Error while handling DELETE /api/v1/items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
 
// Function to load all tasks of a specific user from 'MongoDB'.
async function loadItemsFromDb(user: any) {
  try {
    // Retrieving a user by his 'id'.
    const foundUser = await User.findById(user._id);

    if (!foundUser) {
      throw new Error("User not found");
    }

    return foundUser.todos;
  } catch (error) {
    throw new Error(`Failed to load items from the database: ${error}`);
  }
}