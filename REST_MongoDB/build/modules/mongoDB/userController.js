import mongoose from "mongoose";
import { models } from "../models/item.js";
import bcrypt from "bcryptjs";
const { User } = models;
export const register = async (req, res) => {
    try {
        const { login, pass } = req.body;
        if (!login || !pass) {
            return res.status(400).json({ error: "Login and password are required" });
        }
        const user = await User.findOne({ login });
        if (user) {
            return res
                .status(400)
                .json({ error: "Пользователь с таким логином уже существует" });
        }
        const encryptedPassword = await bcrypt.hash(req.body.pass, 10);
        await registerUser(login, encryptedPassword);
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
        const user = await User.findOne({ login });
        if (user && (await bcrypt.compare(pass, String(user.pass)))) {
            req.session.user = user;
            res.send({ ok: true });
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
async function registerUser(login, pass) {
    try {
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            login,
            pass,
            todos: [],
        });
        const savedUser = await newUser.save();
        return savedUser;
    }
    catch (error) {
        throw new Error(`Failed to register user: ${error}`);
    }
}
