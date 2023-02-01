import dotenv from 'dotenv';
dotenv.config();

export const {
    APP_PORT,
    DEBUG_MODE,
    MONGODB_URL
} = process.env;