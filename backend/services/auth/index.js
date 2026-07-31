import express from "express";
import dotenv from "dotenv"
import session from "express-session";
dotenv.config()
import UserRoute from "../auth/routes/user.route.js"

const port = process.env.PORT || 8001
const app = express()

app.use(express.json())

app.use(session({secret:"mysecret123"}))

app.use("/" , UserRoute)

app.listen(port , (req , res)=>{
    console.log("Auth Server is listening on port: ",port)
})