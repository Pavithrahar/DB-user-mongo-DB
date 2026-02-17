const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const noteController = require("../controllers/noteController");

router.post("/", authMiddleware, noteController.createNote);
router.get("/", authMiddleware, noteController.getNotes);
router.get("/:id", authMiddleware, noteController.getNoteById);
router.patch("/:id", authMiddleware, noteController.updateNote);
router.delete("/:id", authMiddleware, noteController.deleteNote);

module.exports = router;
