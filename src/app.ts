import express, {Request, Response} from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { connectDb } from "./config/db/connectDb"
const app = express()
// import product routes from productRoutes file in routers folder
import productRoutes from "./routers/productRoutes"
import  cartRoutes from "./routers/cartRoutes"
import categoryRoutes from "./routers/categoryRoutes"
import userRoutes from "./routers/userRoutes"
import authRoutes from "./routers/authRoutes"
import orderRoutes from "./routers/orderRoutes"
import resetPasswordRoutes from "./routers/resetPasswordRoutes"

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
import path from "path"



// cnnect to database
dotenv.config()
connectDb()
 app.use(express.json())
 app.use(cors({
  origin: "*",
}));

const PORT = process.env.PORT || 3000

// middleware
// swagger api setup

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));
//  Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// routes
app.use("/api", productRoutes)
app.use("/api", cartRoutes)
app.use("/api", categoryRoutes)
app.use("/api", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api", orderRoutes)
app.use("/api", resetPasswordRoutes)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})