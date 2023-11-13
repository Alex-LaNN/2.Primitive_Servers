import * as app from "./dataController.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
    try {
        const { login, pass } = req.body;
        if (!login || !pass) {
            return res
                .status(400)
                .json({ error: "Login and password are required!" });
        }
        const users = await app.loadUsersFromDb();
        const encryptedPassword = await bcrypt.hash(req.body.pass, 10);
        const existingUser = users.find((user) => user.login === login);
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "A user with this login already exists!" });
        }
        await app.registerUser(login, encryptedPassword);
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
        const user = await app.findUserInDb(login);
        if (user && (await bcrypt.compare(pass, String(user.pass)))) {
            req.session.regenerate((error) => {
                if (error) {
                    console.log(`22 Error during session regeneration: ${error}`);
                    return;
                }
                req.session.user = user;
                req.session.save(() => {
                    res.json({ ok: true });
                });
            });
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
