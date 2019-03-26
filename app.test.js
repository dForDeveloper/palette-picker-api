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
      const { id: project_id } = await db('projects').first();
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

  describe('POST /api/v1/projects', () => {
    it('should return 201 and the project id', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send({ name: 'project c'});
      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should add a project to the database', async () => {
      const projectsBefore = await db('projects').select();
      await request(app).post('/api/v1/projects').send({ name: 'project c'});
      const projectsAfter = await db('projects').select();
      expect(projectsAfter.length).toEqual(projectsBefore.length + 1);
    });

    it('should return 422 if no name is sent', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send({});
      expect(response.status).toEqual(422);
    });
  });

  describe('POST /api/v1/palettes', () => {
    let mockPalette;

    beforeEach(async () => {
      const { id: project_id } = await db('projects').first();
      mockPalette = {
        name: 'palette q',
        color1: '#000000',
        color2: '#000000',
        color3: '#000000',
        color4: '#000000',
        color5: '#000000',
        project_id
      };
    });

    it('should return 201 and the palette id', async () => {
      const response = await request(app)
        .post('/api/v1/palettes')
        .send(mockPalette);
      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should add a palette to the database', async () => {
      const palettesBefore = await db('palettes').select();
      await request(app).post('/api/v1/palettes').send(mockPalette);
      const palettesAfter = await db('palettes').select();
      expect(palettesAfter.length).toEqual(palettesBefore.length + 1);
    });

    it('should return 422 if the correct params are missing', async () => {
      const response = await request(app)
        .post('/api/v1/palettes')
        .send({});
      expect(response.status).toEqual(422);
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should return 202 if the correct params are sent', async () => {
      const { id } = await db('projects').first();
      const response = await request(app)
        .patch(`/api/v1/projects/${id}`)
        .send({ name: 'new project name' });
      expect(response.status).toEqual(202);
    });

    it('should edit the name of a project in the database', async () => {
      const expected = await db('projects').first();
      expect(expected.name).not.toEqual('new project name');
      await request(app)
        .patch(`/api/v1/projects/${expected.id}`)
        .send({ name: 'new project name' });
      const [result] = await db('projects').where({ id: expected.id });
      expect(result.name).toEqual('new project name');
    });

    it('should return 422 if the name param is not sent', async () => {
      const { id } = await db('projects').first();
      const response = await request(app)
        .patch(`/api/v1/projects/${id}`)
        .send({});
      expect(response.status).toEqual(422);
    });

    it('should return 404 if no project is found', async () => {
      const response = await request(app)
      .patch(`/api/v1/projects/0`)
      .send({ name: 'new project name' });
      expect(response.status).toEqual(404);
    });
  });
    
  describe('PATCH /api/v1/palettes/:id', () => {
    it('should return 202 if the correct params are sent', async () => {
      const { id } = await db('palettes').first();
      const response = await request(app)
        .patch(`/api/v1/palettes/${id}`)
        .send({ name: 'new palette name' });
      expect(response.status).toEqual(202);
    });

    it('should edit the name of a palette in the database', async () => {
      const expected = await db('palettes').first();
      expect(expected.name).not.toEqual('new palette name');
      await request(app)
        .patch(`/api/v1/palettes/${expected.id}`)
        .send({ name: 'new palette name' });
      const [result] = await db('palettes').where({ id: expected.id });
      expect(result.name).toEqual('new palette name');
    });

    it('should return 422 if the name param is not sent', async () => {
      const { id } = await db('palettes').first();
      const response = await request(app)
        .patch(`/api/v1/palettes/${id}`)
        .send();
      expect(response.status).toEqual(422);
    });

    it('should return 404 if no palette is found', async () => {
      const response = await request(app)
      .patch(`/api/v1/palettes/0`)
      .send({ name: 'new palette name' });
      expect(response.status).toEqual(404);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should return 204 if a project matches the id', async () => {
      const { id } = await db('projects').first();
      const response = await request(app).delete(`/api/v1/projects/${id}`);
      expect(response.status).toEqual(204);
    });

    it('should remove a project from the database', async () => {
      const { id } = await db('projects').first();
      const projectsBefore = await db('projects').select();
      await request(app).delete(`/api/v1/projects/${id}`);
      const projectsAfter = await db('projects').select();
      expect(projectsAfter.length).toEqual(projectsBefore.length - 1);
    });

    it('should remove associated palettes from the database', async () => {
      const { id } = await db('projects').first();
      const palettesBefore = await db('palettes').where({ project_id: id });
      expect(palettesBefore.length).not.toEqual(0);
      await request(app).delete(`/api/v1/projects/${id}`);
      const palettesAfter = await db('palettes').where({ project_id: id });
      expect(palettesAfter.length).toEqual(0);
    });

    it('should return 404 if no project is found', async () => {
      const response = await request(app).delete('/api/v1/projects/0');
      expect(response.status).toEqual(404);
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should return 204 if a palette matches the id', async () => {
      const { id } = await db('palettes').first();
      const response = await request(app).delete(`/api/v1/palettes/${id}`);
      expect(response.status).toEqual(204);
    });

    it('should remove a palette from the database', async () => {
      const { id } = await db('palettes').first();
      const palettesBefore = await db('palettes').select();
      await request(app).delete(`/api/v1/palettes/${id}`);
      const palettesAfter = await db('palettes').select();
      expect(palettesAfter.length).toEqual(palettesBefore.length - 1);
    });

    it('should return 404 if no palette is found', async () => {
      const response = await request(app).delete('/api/v1/palettes/0');
      expect(response.status).toEqual(404);
    });
  });
});