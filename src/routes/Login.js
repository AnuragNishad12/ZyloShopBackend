import express, { Router } from 'express'
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
const route = Router()


route.post('/login', async(req, res) => {
    try {

        const { email, password } = req.body;

        const missingValue = [];


        if (!email) missingValue.push("Email")
        if (!password) missingValue.push("Password")

        if (missingValue.length > 0) {
            res.status(400).json({
                status: false,
                message: `Missing value found ${missingValue.join(', ')}`
            })
        }

     
        const user = await User.findOne({email:email})

        if(!user){
            res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }


        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            res.status(405).json({
                status:false,
                message:"Invalid Password"
            })
        }


        const token = jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )


        res.send(200).json({
            status:true,
            token,
            user:{
                userId:user._id,
                name:user.fullName,
                email:user.email
            }
        })










    } catch (error) {
        res.status(500).json({
            status: false,
            message: `Server Error ${error}`
        })
    }
})