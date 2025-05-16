import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";  // for password hashing comparison
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;  // changed from mobile to password

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password.",
        });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          mobile: user.mobilenumber,
          fullname: user.fullName,
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found. Please create a new account.",
      });
    }
  } catch (error) {
    console.error(`Login Error: ${error}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
