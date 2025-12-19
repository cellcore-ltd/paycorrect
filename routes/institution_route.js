import express from "express";
import { getInstitutions, getInstitution } from "../controllers/institution_controller.js";

const router = express.Router()

router 
    .get("/", getInstitutions)
    .get("/:id", getInstitution)

export default router