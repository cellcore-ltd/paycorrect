import express from "express";
import { getUsers, getUser, updateUser, getProfile, resetPassword } from "../controllers/user_controller.js";

const router = express.Router();

router
    .get("/admin", getUsers)
    .get("/profile", getProfile)
    .get("/admin/:id", getUser)
    .post("/admin/:id", updateUser)
    .post("/reset-password/:token", resetPassword)

export default router;