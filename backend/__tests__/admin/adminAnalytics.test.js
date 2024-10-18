const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary

describe('Admin Analytics View', () => {
  it('should retrieve waste collection analytics data successfully', async () => {
    const res = await request(app).get('/api/admin/analytics');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalCollections');
    expect(res.body.totalCollections).toBeGreaterThan(0);
  });

  it('should return an error when there is no data', async () => {
    const res = await request(app).get('/api/admin/analytics?date=invalid');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid date format');
  });
});
