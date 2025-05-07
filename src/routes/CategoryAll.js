import express from 'express';
import CategoryAll from '../models/CategoryAll.js';

const route = express.Router();


route.get("/category/all",async(req,res)=>{
    try {
        const categories = await CategoryAll.find();
        res.json({success:"Successfull",message:categories})
    } catch (error) {
        res.status(500).json({success:'Failed',message:'Server Error'});
    }
});

export default route;