import mongoose from "mongoose";


export const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("database connected successfully");
    } catch (error) {
        console.log("database connection failed", error);
    }
}
