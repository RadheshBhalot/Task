import express from "express";
import * as UserController from "../controller/user.controller.js";

const router = express.Router(); // Use express.Router() instead of express()

// User routes
router.post("/save", UserController.save);
router.post("/login", UserController.login);
router.post("/forgot-password", UserController. forgotPassword);
router.post("/reset-password", UserController.resetPasswordWithToken);

export default router;
