"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const currentFile = __filename;
const currentDir = path_1.default.dirname(currentFile);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.resolve(currentDir, "client")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(currentDir, "../client/index.html"));
});
app.get("api/v1/items", (req, res) => {
    res.send({ items: [{ id: 22, text: "...", checked: true }] });
});
const server = app.listen(port, () => {
    console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
//# sourceMappingURL=app.js.map