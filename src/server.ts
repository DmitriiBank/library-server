import express from 'express'
import {baseUrl, PORT, db} from "./config/libConfig.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {libRouter} from "./routes/libRouter.js";
import morgan from "morgan";
import * as fs from "node:fs";
import mongoose from "mongoose";
import dotenv from 'dotenv'

export const launchServer = () => {
   //=======load environment=====
    dotenv.config();
    console.log(process.env)
    const app = express()
    app.listen(process.env.PORT, () => console.log(`Server runs at http://localhost:${process.env.PORT}`))
    const logStream = fs.createWriteStream('access.log', {flags: 'a'})
    //===============Middleware============
    app.use(express.json());
    app.use(morgan("dev"))
    app.use(morgan('combined', {stream: logStream}))
    //===============Router================
    app.use('/api', libRouter)
    app.get('/', (_, res) => res.send('API is running'));


    // mongoose.connect(db)
    //     .then(() => console.log('Connected with MongoDB'))
    //     .catch(err => console.error('MongoDB connection error:', err));


    app.use((req, res) => {
            res.status(404).send("Page not fount")
        }
    )

//=============Error===========
    app.use(errorHandler)
}