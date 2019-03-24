const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

const getProjects = async (req, res) => {
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
      projects = await db('projects').where(req.query);
    } else {
      projects = await db('projects').select();
    }
    if (projects.length === 0) return res.sendStatus(404);
    res.status(200).json(projects);
  } catch {
    res.sendStatus(500);
  }
}

const getPalettes = async (req, res) => {
  try {
    const { id: project_id } = req.params;
    const palettes = await db('palettes').where({ project_id });
    if (palettes.length == 0) return res.sendStatus(404);
    res.status(200).json(palettes);
  } catch {
    res.sendStatus(500);
  }
}

const postToProjects = async (req, res) => {
  try {
    if (!req.body.name) return res.status(422).json('name missing from body');
    const [id] = await db('projects').insert(req.body, 'id');
    res.status(201).json({ id });
  } catch {
    res.sendStatus(500);
  }
}

const postToPalettes = async (req, res) => {
  try {
    const palette = req.body;
    const requiredParams = [
      'name',
      'color1',
      'color2',
      'color3',
      'color4',
      'color5',
      'project_id'
    ];
    for (let param of requiredParams) {
      if (!palette[param]) {
        return res.status(422).json(
          `Parameters must be exactly ${requiredParams.join(' ')}.`
        );
      }
    }
    const [id] = await db('palettes').insert(palette, 'id');
    res.status(201).json({ id });
  } catch {
    res.sendStatus(500);
  }
}

const patchProject = async (req, res) => {
  try {
    const { id, editedName } = req.body;
    await db('projects').where({ id }).update({ name: editedName });
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);    
  }
}

const patchPalette = async (req, res) => {
  try {
    const { id, editedName } = req.body;
    await db('palettes').where({ id }).update({ name: editedName });
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);    
  }
}

const deleteProject = async (req, res) => {
  try {
    res.sendStatus(200).json('placeholder response')
  } catch {
    res.sendStatus(500);    
  }
}

const deletePalette = async (req, res) => {
  try {
    res.sendStatus(200).json('placeholder response')
  } catch {
    res.sendStatus(500);    
  }
}

module.exports = {
  getProjects,
  getPalettes,
  postToProjects,
  postToPalettes,
  patchProject,
  patchPalette,
  deleteProject,
  deletePalette
}