import express from 'express'
import Category from '../models/Category.js'

const route = express.Router();

route.get('/allCategory',async (req,res)=>{

try {

    const categories = await Category.find();
    res.status(200).json({success:"Successful",message:categories})
} catch (error) {
    res.status(500).json({success:"Failed",message:"Server Error"})
}


});

export default route;