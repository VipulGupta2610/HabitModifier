import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

export const connectdb = async (req , res)=>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Database connected")
    } catch (error) {
        console.log("Error at connectdb");
        console.log(error)
    }
}