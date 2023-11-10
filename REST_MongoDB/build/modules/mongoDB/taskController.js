import mongoose from "mongoose";
import * as app from "./dataController.js";
import * as getUser from "./userController.js";
import { models } from "../models/item.js";
const { User } = models;
export async function getItems(req, res) {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res
                .status(401)
                .json({ error: "Пользователь не аутентифицирован" });
        }
        const userItems = await app.loadItemsFromDb(currentUser);
        const resItems = userItems.map((item) => {
            return { id: item._id, text: item.text, checked: item.checked };
        });
        res.json({ items: resItems });
    }
    catch (error) {
        console.error("Error while handling GET /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function createItem(req, res) {
    try {
        const userId = await getUser.getId(req, res);
        if (!req.session.user || undefined) {
            return res
                .status(401)
                .json({ error: "Пользователь не аутентифицирован" });
        }
        const { text } = req.body;
        if (!text) {
            return res
                .status(400)
                .json({ error: 'Параметр "text" отсутствует или пуст' });
        }
        const newItem = {
            _id: new mongoose.Types.ObjectId(),
            text,
            checked: false,
        };
        await User.updateOne({ _id: userId }, { $push: { todos: newItem } });
        res.json({ id: newItem._id });
    }
    catch (error) {
        console.error("Error while handling POST /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function updateItem(req, res) {
    try {
        const currentUser = req.session.user;
        const userId = await getUser.getId(req, res);
        if (!currentUser) {
            return res
                .status(401)
                .json({ error: "Пользователь не аутентифицирован" });
        }
        const { id, text, checked } = req.body;
        const userTodos = (await app.loadItemsFromDb(currentUser)) || [];
        const itemIndex = userTodos.findIndex((todo) => todo._id.toString() === id);
        if (itemIndex === -1) {
            return res
                .status(404)
                .json({ error: 'Элемент с указанным "id" не найден' });
        }
        const todo = userTodos[itemIndex];
        if (text) {
            todo.text = text;
        }
        todo.checked = checked;
        await User.updateOne({ _id: userId, "todos._id": id }, {
            $set: {
                "todos.$.text": todo.text,
                "todos.$.checked": todo.checked,
            },
        });
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error while handling PUT /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function deleteItem(req, res) {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res
                .status(401)
                .json({ error: "Пользователь не аутентифицирован" });
        }
        const userId = await getUser.getId(req, res);
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Параметр "id" (удаляемой задачи) отсутствует' });
        }
        await User.updateOne({ _id: userId }, { $pull: { todos: { _id: id } } });
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error while handling DELETE /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
//# sourceMappingURL=taskController.js.map