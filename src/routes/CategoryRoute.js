import express from 'express';
import Category from '../models/Category.js';
import Joi from 'joi'
const route = express.Router();


const CategorySchmeaValidate = Joi.object({
    CategoryName:Joi.string().required().min(3).max(50),
    slug:Joi.string().required().min(3).max(50)
})

route.post("/category", async (valuereq, res) => {
    try {
      
        const{error,value} = CategorySchmeaValidate.validate(req.body);
        if(error){
            res.status(409).json({
                status:false,
                message:error.details[0].message
            })
        }
        const { CategoryName, slug } =value;

        if (!CategoryName || !slug) {
            return res.status(400).json({
                success: "failed",
                message: "CategoryName and slug are required"
            });
        }

        const findcategory = await Category.findOne({ CategoryName });

        if (findcategory) {
            return res.status(409).json({
                success: "failed",
                message: "Category Already Exist"
            });
        }

        const newCategory = new Category({ CategoryName, slug });
        await newCategory.save();

        res.status(201).json({
            success: "success",
            message: "Category created successfully",
            category: newCategory
        });

    } catch (error) {
        res.status(500).json({
            success: "failed",
            message: "Server error",
            details: error.message
        });
    }
});



export default route;
