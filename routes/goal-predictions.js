// Required Imports
const express = require('express');
const { getOverOnePointFive, getOverTwoPointFive, getBothTeamsToScore } = require('../controllers/goal-predictions');

// Create the Router
const router = express.Router();

// Routes
router
    .route('/over-1.5-goals')
    .get(getOverOnePointFive);

router
    .route('/over-2.5-goals')
    .get(getOverTwoPointFive);

router
    .route('/both-teams-to-score')
    .get(getBothTeamsToScore);

// Export the Router
module.exports = router;