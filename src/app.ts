import {launchServer} from "./server.js";
import mongoose from "mongoose";
import {db} from "./config/libConfig.js";

try {
    await mongoose.connect(db);
    console.log('Connected with MongoDB');
    launchServer()
} catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}
