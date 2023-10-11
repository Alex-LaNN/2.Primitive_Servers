import express from "express";
import path from "path";

const currentFile = __filename;
const currentDir = path.dirname(currentFile);

const app = express();
const port = 3000;

app.use(express.json())

app.use("/client", (req, res) => {
  res.sendFile(path.resolve(currentDir, "../client/index.html"));
});

app.get("/api/v1/items", (req, res) => {
  res.send()
})

//app.post()

//app.put()

//app.delete()

const server = app.listen(port, () => {
  console.log(`-(app)- Сервер запущен на порту: ${port}`);
});
