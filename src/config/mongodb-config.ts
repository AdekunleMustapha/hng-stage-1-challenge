import mongoose from "mongoose";
import { MONGO_URI } from "./env-config";

export const connectToDatabase = async () => {
    if(!MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    };
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
}