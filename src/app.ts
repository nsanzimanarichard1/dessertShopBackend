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
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";



// cnnect to database
dotenv.config()
connectDb()
 app.use(express.json())

const PORT = process.env.PORT || 3000

// swagger api setup

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// routes
app.use("/api", productRoutes)
app.use("/api", cartRoutes)
app.use("/api", categoryRoutes)
app.use("/api", userRoutes)
app.use("/api/auth", authRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})