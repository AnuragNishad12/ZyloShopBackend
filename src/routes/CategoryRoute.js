import express from 'express';
import Category from '../models/Category.js';

const route = express.Router();

route.post("/category", async (req, res) => {
    try {
        const { CategoryName, slug } = req.body;

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
