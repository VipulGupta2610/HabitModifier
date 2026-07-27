import express from "express";
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy";

const port = process.env.PORT || 8000
const app = express()

app.use(express.json())

app.use("/api/auth" , proxy((process.env.AUTH_URL)))

app.get("/",(req , res)=>{
    res.status(200).json("Gateway server running successfully")
})

app.listen(port , (req , res)=>{
    console.log("Gateway Server is listening on port: ",port)
})