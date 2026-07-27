import express from "express";
import dotenv from "dotenv"
dotenv.config()

const port = process.env.PORT || 8000
const app = express()

app.listen(port , (req , res)=>{
    console.log("Gateway Server is listening on port: ",port)
})