import mongoose from "mongoose";

const CategoryAllSchema = new mongoose.Schema({}, { collection: 'categories' })

module.exports = mongoose.model('Category', CategoryAllSchema, 'categories');