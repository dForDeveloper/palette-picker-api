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
    it('should return 200 and all projects', async () => {
      const expected = await db('projects').select();
      const response = await request(app).get('/api/v1/projects');
      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(expected.length);
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

  describe('GET /api/v1/projects/:id/palettes', () => {
    const paletteParams = [
      'name',
      'color1',
      'color2',
      'color3',
      'color4',
      'color5',
      'project_id'
    ];

    it('should return 200 and all match palettes', async () => {
      const firstProject = await db('projects').first();
      const { id: project_id } = firstProject;
      const expected = await db('palettes')
        .column(['id', ...paletteParams])
        .where({ project_id });
      const response = await request(app)
        .get(`/api/v1/projects/${project_id}/palettes`);
      expect(response.body).toEqual(expected);
    });

    it('should return 404 if no palettes are found', async () => {
      const response = await request(app)
        .get(`/api/v1/projects/0/palettes`);
      expect(response.status).toEqual(404);
    });
  });
});