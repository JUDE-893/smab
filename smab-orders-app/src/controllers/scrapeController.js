import { scrape as scrapeService } from '../services/playwrightScraper.js';

export const scrape = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const data = await scrapeService(url);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}; 