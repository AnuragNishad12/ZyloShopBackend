import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();


router.post("/product", async (req, res) => {
    try {
        const {
            name, slug, description, price,
            brand, category, images,
            stock, isFeatured
        } = req.body;

        if (!name || !slug || !price || !category) {
            return res.status(400).json({
                success: "failed",
                message: "name, slug, price, and category are required"
            });
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({
                success: "failed",
                message: "Category not found"
            });
        }

        const newProduct = new Product({
            name, slug, description, price,
            brand, category, images,
            stock, isFeatured
        });

        await newProduct.save();

        res.status(201).json({
            success: "success",
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        res.status(500).json({
            success: "failed",
            message: "Server error",
            details: error.message
        });
    }
});

// Get all products by category ID
router.get("/products/category/:categoryId", async (req, res) => {
    try {
        const { categoryId } = req.params;

        const products = await Product.find({ category: categoryId }).populate('category');

        res.status(200).json({
            success: "success",
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: "failed",
            message: "Server error",
            details: error.message
        });
    }
});

export default router;
