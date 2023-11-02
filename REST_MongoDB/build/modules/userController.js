import * as app from "./dataController.js";
export const login = async (req, res) => {
    try {
        const { login, pass } = req.body;
        const user = await app.findUserInDb(login, pass);
        if (user) {
            req.session.regenerate((error) => {
                if (error) {
                    console.log(`17 ${error}`);
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
export const register = async (req, res) => {
    try {
        const { login, pass } = req.body;
        if (!login || !pass) {
            return res.status(400).json({ error: "Логин и пароль обязательны" });
        }
        const users = await app.loadUsersFromDb();
        const existingUser = users.find((user) => user.login === login);
        if (existingUser) {
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
//# sourceMappingURL=userController.js.map