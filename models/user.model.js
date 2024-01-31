const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [255, "Name cannot exceed 255 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      minlength: [6, "Email must be at least 6 characters long"],
      maxlength: [255, "Email cannot exceed 255 characters"],
    },
    photoURL: {
      type: String,
    },
    uid: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
