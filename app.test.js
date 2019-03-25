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

    it('should return a single project matching the name param', async () => {
      const expected = await db('projects')
        .column(['id', 'name'])
        .where({ name: 'project a' });
      const response = await request(app)
        .get('/api/v1/projects?name=project+a');
      expect(response.body).toEqual(expected);
    });

    it('should return 422 if a param other than name is sent', async () => {
      const response = await request(app)
        .get('/api/v1/projects?wrongparam=project+a');
      expect(response.status).toEqual(422);
    });

    it('should return 404 if no project is found', async () => {
      const response = await request(app)
      .get('/api/v1/projects?name=missing+project');
      expect(response.status).toEqual(404);
    });
  });
});