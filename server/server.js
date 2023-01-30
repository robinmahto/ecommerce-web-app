import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
dotenv.config();
const app = express();
const PORT = process.env.APP_PORT || 4000

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
app.use('/api', routes)


// APP PORT
app.listen(PORT, ()=> console.log(`app running on ${PORT}`))