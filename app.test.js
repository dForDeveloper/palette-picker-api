const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);

describe('queries', () => {
  beforeEach(async () => {
    await db.seed.run();
  });

  describe('GET /api/v1/projects?', () => {
    it('should return a status of 200 and all projects', async () => {
      const projects = await db('projects').select();
      const response = await request(app).get('/api/v1/projects');
      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(projects.length);
    });
  });
});