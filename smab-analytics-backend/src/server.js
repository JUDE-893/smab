import app from './app.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import connectMongoDB from './config/db/mongoDB.js';

dotenv.config();

// CONNECT TO MONGODB
connectMongoDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
