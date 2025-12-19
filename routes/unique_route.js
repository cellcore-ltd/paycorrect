import express, { Router } from "express";
import { forgotPassword, login, logout, refresh, register } from "../controllers/unique_controller.js";

const router = express.Router();

router
    .post("/register-information", register)
    .post("/login", login)
    .post("/logout", logout)
    .get("/refresh", refresh)
    .post("/forgot-password", forgotPassword)
    
export default router;