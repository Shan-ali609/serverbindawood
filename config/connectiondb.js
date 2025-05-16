import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error(
        "please provide mongodb uri in the dotenv file"
    )
}

 async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongoDB  connected successfully");
        
    } catch (error) {
        console.log("MongoDB not connected",error);
    
        process.exit(1)
    }
}

export default connectDB


