const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Admin Personnel Assignment', () => {
  it('should successfully assign personnel to a waste collection task', async () => {
    const res = await request(app)
      .post('/api/admin/assign-personnel')
      .send({
        personnelId: '603eaa4b2c7c980b982fa4b9',
        collectionId: '604eaa4b2c7c980b982fa4c2',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
