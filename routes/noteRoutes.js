const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

// Create a new note
router.post("/", noteController.createNote);

// Get all notes
router.get("/", noteController.getNotes); // <-- match your controller

// Get a single note by ID
router.get("/:id", noteController.getNoteById);

// Update a note by ID
router.put("/:id", noteController.updateNote); // PATCH or PUT depending on your choice

// Delete a note by ID
router.delete("/:id", noteController.deleteNote);

module.exports = router;