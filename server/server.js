import express from 'express';
import routes from './routes';
import path from 'path';
import { APP_PORT } from './config';
import { errorHandler } from './middlewares';
import { dbConnection } from './db';
const app = express();

global.appRoot = path.resolve(__dirname);

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));;

// routes
app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

// custom middleware
app.use(errorHandler);

// APP PORT
app.listen(APP_PORT, ()=> {
    dbConnection();  // db connection
    console.log(`app running on ${APP_PORT}`)
});