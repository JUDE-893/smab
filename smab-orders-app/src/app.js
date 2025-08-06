import express from 'express';
import dotenv from 'dotenv';
// import scrapeRouter from './routes/scrape.js';
// import watchMailService from './services/watchMailService.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World');
});
const watchMailService = (await import("./services/watchMailService.js")).default;
watchMailService(app).then()

// app.use('/scrape', scrapeRouter);
app.use(errorHandler);

export default app;
