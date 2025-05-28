import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
      const { fullName, email, password, mobile } = req.body;

      const missingfields = [];

      if(!fullName) missingfields.push("Full Name");
      if(!email) missingfields.push("Email");
      if(!password) missingfields.push("Password");
      if(!mobile) missingfields.push("Mobile Number")

        if(missingfields.length>0){
          return res.status(400).json({status:false,
            message:`Missing Field are ${missingfields.join(', ')}`
          })
        }


  
      const existingUser = await User.findOne({ mobilenumber:mobile });
  
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        mobilenumber:mobile
      });
  
      await newUser.save();
  
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          mobile: newUser.mobile,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


export default router;