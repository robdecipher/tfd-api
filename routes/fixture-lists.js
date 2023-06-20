// Required Imports
const express = require('express');
const { getFixtureLists, getFixture, createFixture, updateFixture, deleteFixture } = require('../controllers/fixture-lists');

// Create the Router
const router = express.Router();

// Routes
router
    .route('/')
    .get(getFixtureLists)
    .post(createFixture);

router
    .route('/:id')
    .get(getFixture)
    .put(updateFixture)
    .delete(deleteFixture);

// Export the Router
module.exports = router;