const express = require('express');
const router = express.Router();
const db = require('../../db/queries');

router.get('/projects?', db.getProjectByQuery);
router.get('/projects/:id/palettes', db.getPalettes);
router.post('/projects', db.postToProjects);
router.post('/palettes', db.postToPalettes);

module.exports = router;