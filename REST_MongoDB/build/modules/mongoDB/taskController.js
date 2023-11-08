import * as app from "./dataController.js";
export async function getItems(req, res) {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res
                .status(401)
                .json({ error: "Пользователь не аутентифицирован" });
        }
        const userItems = await app.loadItemsFromDb(currentUser);
        res.json({ items: userItems });
    }
    catch (error) {
        console.error("Error while handling GET /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
//# sourceMappingURL=taskController.js.map