import express from 'express';
import routes from './routes';
import { APP_PORT } from './config';
import { errorHandler } from './middlewares';
import { dbConnection } from './db';
const app = express();

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
app.use('/api', routes)

// custom middleware
app.use(errorHandler)

// APP PORT
app.listen(APP_PORT, ()=> {
    dbConnection();  // db connection
    console.log(`app running on ${APP_PORT}`)
})