import * as app from "./dataController.js";
import Item from "../models/item.js";
import session from "express-session";
import FileStoreFactory from "session-file-store";
const FileStore = FileStoreFactory(session);
export const register = async (req, res) => {
    try {
        const { login, pass } = req.body;
        if (!login || !pass) {
            return res.status(400).json({ error: "Логин и пароль обязательны" });
        }
        const user = await Item.findOne({ login });
        if (user) {
            return res
                .status(400)
                .json({ error: "Пользователь с таким логином уже существует" });
        }
        await app.registerUser(login, pass);
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error while handling 'register':", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { login, pass } = req.body;
        const user = await Item.findOne({ login });
        console.dir(`51 (mongoDB.userController): ${user}`);
        if (user) {
            console.log(`++++++++++++++`);
            req.session.user = user;
            res.send(JSON.stringify({ ok: true }));
        }
        else {
            res.status(401).json({ ok: false });
        }
    }
    catch (error) {
        console.error("Error while handling 'login':", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
};
//# sourceMappingURL=userController.js.map