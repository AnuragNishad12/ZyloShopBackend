import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    brand: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    ratings: [ratingSchema],
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;