import express from "express";
import authRouter from "./auth.js";

const router = express.Router();

router.use("/api/auth", authRouter);

export default router;
