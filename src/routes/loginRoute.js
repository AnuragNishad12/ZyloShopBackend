import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();


const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

router.post("/login", async (req, res) => {
  try {
    console.log("Login request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please create a new account.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    console.log("Creating tokens...");
    const accessToken = jwt.sign(
      { userId: user._id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobilenumber,
        fullname: user.fullName,
      },
    });

  } catch (error) {
    console.error(`Login Error:`, error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


router.post("/RefreshToken",async(req,res)=>{
  const token = req.cookies.refreshToken;


  if(!token){
    res.status(401).json({success:"Failed",
      message:"No Refresh Token is provided"
    })
  }

   jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or Expired Refresh Token",
      });
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  });
});


export default router;
