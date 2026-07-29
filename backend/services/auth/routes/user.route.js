import express from "express";
import { signup } from "../controllers/user.controller.js";

const router = express.Router()

router.post("/api/auth/signpup" , signup)

export default router;