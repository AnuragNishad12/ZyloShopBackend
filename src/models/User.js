import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: {type: String , required:true,unique:true, match: /.+\@.+\..+/},
    password: {type: String, required: true},
    mobilenumber: {type: String , required: true,unique:true}
},{timestamps:true})


export default mongoose.model("User",userSchema)