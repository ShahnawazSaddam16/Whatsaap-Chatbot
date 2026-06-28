const request = require('supertest');
const app = require('../../src/app');

describe('Root API', () => {
  it('should return API information on root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'WhatsApp Chatbot is running');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('endpoints');
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route not found');
  });
});
