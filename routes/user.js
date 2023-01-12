const express = require("express");

const router = express.Router();
const { createUser, userSignIn } = require("../controllers/user");
const { isAuth } = require("../middlewares/auth");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middlewares/validation/user");

const User = require("../models/user");

const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};

const uploads = multer({ storage, fileFilter });

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
// router.post("/create-post", isAuth, (req, res) => {
//   res.send("welcome you are in secret route");
// });

router.post(
  "/upload-profile",
  isAuth,
  uploads.single("profile"),
  async (req, res) => {
    const { user } = req;
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "unauthorized access!" });

    try {
      const profileBuffer = req.file.buffer;
      const { width, height } = await sharp(profileBuffer).metadata();
      const avatar = await sharp(profileBuffer)
        .resize(Math.round(width * 0.5), Math.round(height * 0.5))
        .toBuffer();
      // console.log(imageInfo);
      // res.send("ok");

      // console.log(avatar);
      await User.findByIdAndUpdate(user._id), { avatar };
      res
        .status(201)
        .json({ success: true, message: "Your Profile has updated!" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "server error, try after some time" });
      console.log("Error while uploading profile image", error.message);
    }
  }
);

module.exports = router;
