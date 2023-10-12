"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const currentFile = __filename;
const currentDir = path_1.default.dirname(currentFile);
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3005;
app.use("/client", (req, res) => {
    res.sendFile(path_1.default.resolve(currentDir, "../client/index.html"));
});
app.use(body_parser_1.default.json());
let lastItemId = 0;
const items = [];
app.get("/api/v1/items", (req, res) => {
    const itemsResponse = items.map((item) => ({
        id: item.id,
        text: item.text,
        checked: item.checked,
    }));
    res.json({ items: itemsResponse });
});
app.post("/api/v1/items", (req, res) => {
    const { text } = req.body;
    if (text) {
        lastItemId++;
        const newItem = { id: lastItemId, text, checked: false };
        items.push(newItem);
        res.json({ id: lastItemId });
    }
    else {
        res.status(400).json({ error: 'Параметр "text" отсутствует или пуст' });
    }
});
app.put('/api/v1/items', (req, res) => {
    const { id, text, checked } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }
    const itemToUpdate = items.find((item) => item.id === id);
    if (!itemToUpdate) {
        return res.status(404).json({ error: 'Элемент с указанным "id" не найден' });
    }
    if (text) {
        itemToUpdate.text = text;
    }
    if (typeof checked === 'boolean') {
        itemToUpdate.checked = checked;
    }
    res.json({ ok: true });
});
app.delete('/api/v1/items', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Параметр "id" отсутствует' });
    }
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Элемент с указанным "id" не найден' });
    }
    items.splice(itemIndex, 1);
    res.json({ ok: true });
});
const server = app.listen(port, () => {
    console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
//# sourceMappingURL=app.js.map