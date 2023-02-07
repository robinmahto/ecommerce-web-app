import dotenv from 'dotenv';
dotenv.config();

export const {
    APP_PORT,
    DEBUG_MODE,
    MONGODB_URL,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    APP_URL
} = process.env;