import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Email and mobile are required.",
      });
    }

    const user = await User.findOne({ email: email, mobilenumber: mobile });

    if (user) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token, // ✅ Return token here
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
