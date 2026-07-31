import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    try {
        const { name, email, isPass, password } = req.body;
        const isExist = await User.findOne({ email: email })
        if (isExist) {
            console.log("User already exists")
            return res.status(500).json({ message: "User already exists.Try to Login." })
        }
        if (isPass) {
            const hashedpass = await bcrypt.hash(password, 10);
            await  User.create({
                name: name,
                email: email,
                isPass: true,
                password: hashedpass
            })
            const sending_user = await User.findOne({ email: email }).select("-password -isPass")
            return res.status(200).json({ message: "User created.", sending_user })
        }
        else {
            await User.create({
                name: name,
                email: email,
                isPass: false,
            })
            const sending_user = await User.findOne({ email: email })
            return res.status(200).json({ message: "User created.", sending_user })
        }

    } catch (error) {
        console.log("Error at signup")
        console.log(error)
        return res.status(500).json({ message: "Internal server error ", error })
    }
}