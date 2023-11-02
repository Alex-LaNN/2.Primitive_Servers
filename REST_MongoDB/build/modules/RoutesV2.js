import express from "express";
import * as taskController from "../modules/taskController.js";
import * as userController from "../modules/userController.js";
const router = express.Router();
router.all("/router", (req, res) => {
    const action = req.query.action;
    if (!action) {
        return res.status(400).json({ error: "Missing 'action' parameter" });
    }
    switch (action) {
        case "login":
            userController.login(req, res);
            break;
        case "logout":
            userController.logout(req, res);
            break;
        case "register":
            userController.register(req, res);
            break;
        case "getItems":
            taskController.getItems(req, res);
            break;
        case "deleteItem":
            taskController.deleteItem(req, res);
            break;
        case "addItem":
            taskController.createItem(req, res);
            break;
        case "editItem":
            taskController.updateItem(req, res);
            break;
        default:
            res.status(400).json({ error: "Invalid 'action' parameter" });
    }
});
export default router;
//# sourceMappingURL=RoutesV2.js.map