import express from 'express'
import {baseUrl, PORT} from "./config/libConfig.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {libRouter} from "./routes/libRouter.js";

export const launchServer = () => {
    const app = express()
    app.listen(PORT, () => console.log(`Server runs at ${baseUrl}`))

    //===============Middleware============
    app.use(express.json());

    //===============Router================
    app.use('/api', libRouter)
    app.use((req, res) => {
            res.status(404).send("Page not fount")
        }
    )

//=============Error===========
    app.use(errorHandler)
}