import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        CategoryName:{
            type:String,
            required:true,
            unique:true,
        },
        slug:{
            type:String,
            required:true,
            unique:true
        }

    },{timeseries:true}
)

export default mongoose.model("Category",CategorySchema);