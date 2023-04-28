import express from "express";
import authRouter from "./auth.js";
import preferencesRouter from "./preferences.js";
import newsRouter from "./news.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/preferences", preferencesRouter);
router.use("/news", newsRouter);

export default router;
