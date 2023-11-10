import * as app from "./dataController.js";
import { models } from "../models/item.js";
const { User } = models;
export const register = async (req, res) => {
    try {
        const { login, pass } = req.body;
        if (!login || !pass) {
            return res.status(400).json({ error: "Логин и пароль обязательны" });
        }
        const user = await User.findOne({ login });
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
        const { login } = req.body;
        const user = await User.findOne({ login });
        if (user) {
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
export async function getId(req, res) {
    const currentUser = req.session.user;
    const login = currentUser === null || currentUser === void 0 ? void 0 : currentUser.login;
    const user = await User.findOne({ login });
    const userId = user === null || user === void 0 ? void 0 : user._id;
    return userId;
}
//# sourceMappingURL=userController.js.map