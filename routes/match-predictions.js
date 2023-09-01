// Required Imports
const express = require('express');
const { getMatchPredictions } = require('../controllers/match-predictions');

// Create the Router
const router = express.Router();

// Routes
router
    .route('/')
    .get(getMatchPredictions);

// Export the Router
module.exports = router;