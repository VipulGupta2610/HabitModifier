import express from "express";
import dotenv from "dotenv"
import session from "express-session";
dotenv.config()
import UserRoute from "../auth/routes/user.route.js"
import { connectdb } from "./config/db.js";

const port = process.env.PORT || 8001
const app = express()

app.use(express.json())

app.use(session({secret:"mysecret123",resave:false}))

app.use("/" , UserRoute)

app.listen(port , (req , res)=>{
    connectdb()
    console.log("Auth Server is listening on port: ",port)
})