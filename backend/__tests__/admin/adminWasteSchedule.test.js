const request = require('supertest');
const app = require('../../server'); // Use the app instance

describe('Admin Waste Collection Schedule Management', () => {
  it('should create a new waste collection schedule successfully', async () => {
    const res = await request(app)
      .post('/api/admin/schedule-collection')
      .send({
        location: 'Colombo',
        wasteType: 'Organic',
        collectionDate: '2024-11-01',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should fail to create a schedule with invalid data', async () => {
    const res = await request(app)
      .post('/api/admin/schedule-collection')
      .send({
        location: 'Colombo',
        collectionDate: '2024-11-01', // Missing wasteType
      });

    expect(res.statusCode).toBe(400);
  });
});
