import app from './app.js';
import logger from './utils/logger.js';
import connectMongoDB from './config/db/mongoDB.js'

const PORT = process.env.PORT || 5000;

// CONNECT TO MONGODB
connectMongoDB();

// START A SERVER
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
}); 