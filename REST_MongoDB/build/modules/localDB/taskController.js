import * as app from "./dataController.js";
export async function getItems(req, res) {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.status(401).json({ error: "User is not authenticated" });
        }
        const itemsDb = await app.loadItemsFromDb();
        const userItems = itemsDb[currentUser.login] || [];
        res.json({ items: userItems });
    }
    catch (error) {
        console.error("Error while handling GET /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function createItem(req, res) {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.status(401).json({ error: "User is not authenticated" });
        }
        const { text } = req.body;
        if (!text) {
            return res
                .status(400)
                .json({ error: 'The "text" parameter is missing or empty' });
        }
        const itemsDb = await app.loadItemsFromDb();
        const userItems = itemsDb[currentUser.login] || [];
        const newId = await app.incrementNumberOfAllTasks();
        const newItem = { id: newId, text, checked: false };
        userItems.push(newItem);
        itemsDb[currentUser.login] = userItems;
        await app.saveItemsToDb(itemsDb);
        res.json({ id: newItem.id });
    }
    catch (error) {
        console.error("Error while handling POST /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function updateItem(req, res) {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.status(401).json({ error: "User is not authenticated" });
        }
        const { id, text, checked } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'The "id" parameter is missing' });
        }
        const itemsDb = await app.loadItemsFromDb();
        const userItems = itemsDb[currentUser.login] || [];
        const itemIndex = userItems.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            return res
                .status(404)
                .json({ error: 'The element with the specified "id" was not found' });
        }
        if (text) {
            userItems[itemIndex].text = text;
        }
        userItems[itemIndex].checked = checked;
        itemsDb[currentUser.login] = userItems;
        await app.saveItemsToDb(itemsDb);
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
            return res.status(401).json({ error: "User is not authenticated" });
        }
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'The "id" parameter is missing' });
        }
        const itemsDb = await app.loadItemsFromDb();
        const userItems = itemsDb[currentUser.login] || [];
        const itemIndex = userItems.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            return res
                .status(404)
                .json({ error: 'The element with the specified "id" was not found' });
        }
        userItems.splice(itemIndex, 1);
        itemsDb[currentUser.login] = userItems;
        await app.saveItemsToDb(itemsDb);
        res.json({ ok: true });
    }
    catch (error) {
        console.error("Error while handling DELETE /api/v1/items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
