const express = require('express');
const router = express.Router();
const db = require('../../db/queries');

router.get('/projects?', db.getProjects);
router.get('/projects/:id/palettes', db.getPalettes);
router.post('/projects', db.postToProjects);
router.post('/palettes', db.postToPalettes);
router.patch('/projects/:id', db.patchProject);
router.patch('/palettes/:id', db.patchPalette);
router.delete('/projects/:id', db.deleteProject);
router.delete('/palettes/:id', db.deletePalette);

module.exports = router;