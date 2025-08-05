import request from 'supertest';
import app from '../../src/app.js';

describe('/scrape endpoint', () => {
  it('should return title for a valid URL', async () => {
    const res = await request(app)
      .post('/scrape')
      .send({ url: 'https://example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('title');
  });

  it('should return 400 if url is missing', async () => {
    const res = await request(app)
      .post('/scrape')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 