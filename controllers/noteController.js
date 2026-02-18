const Note = require("../models/Note");

//create note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields required" });
    }

    const note = await Note.create({
      user: req.user.userId,
      title,
      content
    });

    res.status(201).json(note);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//get single note
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//update note -PATCH 
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
