import express from "express";
import * as taskController from "./taskController.js";
import * as userController from "./userController.js";
const router = express.Router();
router.get("/items", taskController.getItems);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);
export default router;
//# sourceMappingURL=RoutesV1.js.map