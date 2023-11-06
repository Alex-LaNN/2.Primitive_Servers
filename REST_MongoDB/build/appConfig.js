import dotenv from "dotenv";
dotenv.config();
const dbType = process.env.DB_TYPE;
let mainApp;
if (dbType === "local") {
    mainApp = require("./modules/localDB/app.js").app;
}
else if (dbType === "mongo") {
    mainApp = require("./mongoApp.js").app;
}
else if (dbType === "memory") {
    mainApp = require("./modules/memoryDB/app.js").app;
}
else if (dbType === "mysql") {
    mainApp = require("./mysqlApp.js").app;
}
export { mainApp as app };
//# sourceMappingURL=appConfig.js.map