const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [2, "Title must be at least 2 characters long"],
      maxlength: [255, "Title cannot exceed 255 characters"],
    },
    about: {
      type: String,
      required: [true, "About is required"],
      minlength: [6, "About must be at least 6 characters long"],
      maxlength: [255, "About cannot exceed 255 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
