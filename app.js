const express = require('express');
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);

const app = express();
app.use(express.json());
app.use(cors());

const paletteParams = [
  'name',
  'color1',
  'color2',
  'color3',
  'color4',
  'color5',
  'project_id'
];

app.get('/api/v1/projects?', async (req, res) => {
  try {
    for (param in req.query) {
      if (param !== 'name') {
        return res.status(422).json(
          `'name' is the only valid query parameter. ${param} is invalid.`
        );
      }
    }
    let projects;
    if (req.query.name) {
      projects = await db('projects').column(['id', 'name']).where(req.query);
    } else {
      projects = await db('projects').column(['id', 'name']).select();
    }
    if (!projects.length) return res.sendStatus(404);
    res.status(200).json(projects);
  } catch {
    res.sendStatus(500);
  }
});

app.get('/api/v1/projects/:id/palettes', async (req, res) => {
  try {
    const { id: project_id } = req.params;
    const columns = ['id', ...paletteParams]
    const palettes = await db('palettes')
      .column(columns)
      .where({ project_id });
    if (!palettes.length) return res.sendStatus(404);
    res.status(200).json(palettes);
  } catch {
    res.sendStatus(500);
  }
});

app.post('/api/v1/projects', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(422).json('Please provide a name.');
    const [id] = await db('projects').insert({ name }, 'id');
    res.status(201).json({ id });
  } catch {
    res.sendStatus(500);
  }
});

app.post('/api/v1/palettes', async (req, res) => {
  try {
    const palette = req.body;
    for (let param of paletteParams) {
      if (!palette[param]) {
        const message = (
          'Request body must include ' +
          'name: <string>, ' +
          'color1: <string>, ' +
          'color2: <string>, ' +
          'color3: <string>, ' +
          'color4: <string>, ' +
          'color5: <string>, ' +
          'and project_id: <number>. ' +
          `Please provide ${param}.`
        );
        return res.status(422).json(message);
      }
    }
    const [id] = await db('palettes').insert(palette, 'id');
    res.status(201).json({ id });
  } catch {
    res.sendStatus(500);
  }
});

app.patch('/api/v1/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(422).json('Please provide a name.');
    const foundProjects = await db('projects').where({ id });
    if (!foundProjects.length) return res.sendStatus(404);
    await db('projects').where({ id }).update({ name });
    res.sendStatus(202);
  } catch {
    res.sendStatus(500);
  }
});

app.patch('/api/v1/palettes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(422).json('Please provide a name.');
    const foundPalettes = await db('palettes').where({ id });
    if (!foundPalettes.length) return res.sendStatus(404);
    await db('palettes').where({ id }).update({ name });
    res.sendStatus(202);
  } catch {
    res.sendStatus(500);
  }
});

app.delete('/api/v1/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const foundProjects = await db('projects').where({ id });
    if (!foundProjects.length) return res.sendStatus(404);
    await db('palettes').where({ project_id: id }).del();
    await db('projects').where({ id }).del();
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
});

app.delete('/api/v1/palettes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const foundPalettes = await db('palettes').where({ id });
    if (!foundPalettes.length) return res.sendStatus(404);
    await db('palettes').where({ id }).del();
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
});

module.exports = app;