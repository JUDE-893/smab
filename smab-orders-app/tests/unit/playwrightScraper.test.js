import { scrape } from '../../src/services/playwrightScraper.js';

test('scrape returns title for example.com', async () => {
  const result = await scrape('https://example.com');
  expect(result).toHaveProperty('title');
  expect(typeof result.title).toBe('string');
}); 