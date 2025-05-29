import express from 'express';
import bcrypt from 'bcryptjs';
import jwt, { sign } from 'jsonwebtoken';
import User from '../models/User.js';
import Joi from 'joi'


const router = express.Router();

const signupValidationSchema = Joi.object({
  fullName:Joi.string().min(3).max(50).required(),
  email:Joi.string().email().required(),
  password:Joi.string().min(6).required(),
  mobilenumber:Joi.string().pattern(/^\d{10}$/).required()
});



router.post('/signup', async (req, res) => {
    try {

    const{error,value} = signupValidationSchema.validate(req.body);
    if(error){
      res.status(400).json({
        status:false,
        message:error.details[0].message
      });
    }


      const { fullName, email, password, mobile } = value

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


  
      const existingUser = await User.findOne({
        $or:[{mobilenumber:mobile},{email:email}]
      });
  
       if (existingUser) {
      return res.status(409).json({ message: 'User with this email or mobile number already exists' });
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