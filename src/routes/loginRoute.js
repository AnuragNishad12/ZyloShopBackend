import express from "express"
import User from '../models/User.js';

const router = express.Router();


router.post("/login",async (req,res)=>{
 try {

    const {email,mobile} = req.body

    if(!email || !mobile){
    return res.status(400).json({success:false,message:"Email and mobile are required."})
    }


    const user = await User.findOne({email:email,mobilenumber:mobile})

    if(user){
        return res.status(200).json({
            success:true,
            message:"Login Successful",
            user:{
                id:  user._id,
                email: user.email,
                mobile:user.mobilenumber,
                fullname:user.fullName
            }
        });
    }else{
        return res.status(404).json({success: false,message:"User not found. Please create a new account."});
    }


    
 } catch (error) {
    console.log(`Login Error ${error}`);
 }



});

export default router;