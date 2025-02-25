// server.test.js
const request = require('supertest');
const app = require('../server/server'); // Import the app from server.js

describe('GET /api/location', () => {
  it('should return location data', async () => {
    const res = await request(app)
      .get('/api/location')
      .query({ destination: 'Paris' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('geonames');
    expect(res.body.geonames.length).toBeGreaterThan(0);
  });

  it('should return 404 if no location data found', async () => {
    const res = await request(app)
      .get('/api/location')
      .query({ destination: 'InvalidLocation' });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/weather', () => {
  it('should return weather data', async () => {
    const res = await request(app)
      .get('/api/weather')
      .query({ lat: '48.8566', lng: '2.3522' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should return 404 if no weather data found', async () => {
    const res = await request(app)
      .get('/api/weather')
      .query({ lat: '999', lng: '999' });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/image', () => {
  it('should return image data', async () => {
    const res = await request(app)
      .get('/api/image')
      .query({ destination: 'Paris' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('hits');
    expect(res.body.hits.length).toBeGreaterThan(0);
  });

  it('should return 404 if no image found', async () => {
    const res = await request(app)
      .get('/api/image')
      .query({ destination: 'InvalidDestination' });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});