import express from "express";
import {
  setPreferences,
  updatePreferences,
} from "../controllers/preferences.js";
const router = express.Router();

/**
 * @route   GET /preferences
 * @desc    Get the preferences of the logged in user
 * @access  Private
 */
router.get("", setPreferences);

/**
 * @route   PUT /preferences
 * @desc    Update the preferences of the logged in user
 * @access  Private
 */
router.put("", updatePreferences);

export default router;
