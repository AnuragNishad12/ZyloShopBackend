import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    discountPercentage:{
        type:Number,
        required:true
    },
    productIds:[mongoose.Schema.Types.ObjectId],
    expiryDate:{
        type:Date,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    isActive: Boolean,
    createdAt: { type: Date, default: Date.now },

},{timestamps:true});

const deals = mongoose.model("Deals",dealSchema);
export default deals;