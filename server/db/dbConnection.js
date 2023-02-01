import mongoose from 'mongoose';
import { MONGODB_URL } from '../config';

const dbConnection = ()=>{
     mongoose.connect(MONGODB_URL);
     const db = mongoose.connection;
     db.on('error', console.error.bind('console', 'connection error'))
     db.once('open', ()=>{
        console.log('DB Connected')
     })
}

export default dbConnection;