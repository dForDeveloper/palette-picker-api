const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

const getProjectByQuery = async (req, res) => {
  const projects = await db('projects').where(req.query);
  if (projects.length > 0) return res.status(200).json(projects);
  res.sendStatus(404);
}

const getPalettes = async (req, res) => {
  const { id: project_id } = req.params;
  const palettes = await db('palettes').where({ project_id });
  res.status(200).json(palettes);
}

const postToProjects = async (req, res) => {
  const [id] = await db('projects').insert(req.body, 'id');
  res.status(201).json({ id });
}

const postToPalettes = async (req, res) => {
  const palette = req.body;
  const [id] = await db('palettes').insert(palette, 'id');
  res.status(201).json({ id });
}

module.exports = {
  getProjectByQuery,
  getPalettes,
  postToProjects,
  postToPalettes
}