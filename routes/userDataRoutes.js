const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const UserData = require("../models/UserData");



  // CREATE DATA

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newData = await UserData.create({
      user: req.user.userId,
      title,
      description
    });

    res.status(201).json(newData);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



  // GET ALL DATA (List View)

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Logged-in user ID:", req.user.userId); // 👈 Debug log

    const data = await UserData.find({ user: req.user.userId });

    if (data.length === 0) {
      return res.json({ message: "No data found for this user yet." });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



  // GET SINGLE DATA (Detail View)

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const data = await UserData.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



  // UPDATE DATA (PATCH)

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedData = await UserData.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(updatedData);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


 //  DELETE DATA

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedData = await UserData.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({ message: "Data deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
