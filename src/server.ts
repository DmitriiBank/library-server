import 'express-async-errors';
import express from 'express'
import {errorHandler} from "./errorHandler/errorHandler.js";
import {libRouter} from "./routes/libRouter.js";
import morgan from "morgan";
import * as fs from "node:fs";
import dotenv from 'dotenv'
import {accountRouter} from "./routes/accountRouter.js";
import {SKIP_ROUTES} from "./config/libConfig.js";
import {authentication, skipRoutes} from "./middleware/authentication.js";
import {accountServiceImplMongo} from "./services/AccountServiceImplMongo.js";
import {authorize, checkAccountById} from "./middleware/authorization.js";

export const launchServer = () => {
   //=======load environment=====
    dotenv.config();
    console.log(process.env)
    const app = express()
    app.use(morgan("dev"))
    const logStream = fs.createWriteStream('access.log', {flags: 'a'})
    app.use(morgan('combined', {stream: logStream}))

    //===============Middleware============
    app.use(authentication(accountServiceImplMongo));
    app.use(skipRoutes(SKIP_ROUTES))
    app.use(authorize())
    app.use(express.json());
    app.use(checkAccountById())

    //===============Router================
    app.use('/api', libRouter)
    app.use('/accounts', accountRouter)
    app.get('/', (_, res) => res.send('API is running'));


    app.use((req, res) => {
            res.status(404).send("Page not found")
        }
    )

//=============Error===========
    app.use(errorHandler)

    app.listen(process.env.PORT, () => console.log(`Server runs at http://localhost:${process.env.PORT}`))
}
