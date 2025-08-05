import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler; 