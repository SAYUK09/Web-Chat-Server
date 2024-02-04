const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, photoURL, uid } = req.body;

    const userAlreadyExists = await User.findOne({
      uid: req.body.uid,
    });

    if (userAlreadyExists) {
      return res.status(200).json({ success: true, data: userAlreadyExists });
    } else {
      const user = new User({
        name,
        email,
        photoURL,
        uid,
      });
      const result = await user.save();
      console.log(result, "result");

      res.status(201).json({ success: true, data: user });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
