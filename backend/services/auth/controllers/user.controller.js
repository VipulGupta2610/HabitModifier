import User from "../models/user.model.js";

export const signup = async (req , res)=>{
    try {
        const {name , email} = req.body;
        
    } catch (error) {
        console.log("Error at signup")
        console.log(error)
        return res.status(500).json({message:"Internal server error ",error})
    }
}