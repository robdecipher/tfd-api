// Required Imports
const mongoose = require('mongoose');

// Schema for a Fixture
const GoalsLeagueSchema = new mongoose.Schema({

    leagueID: {
        type:Number,
    },
    avgHomeGSPG: {
        type:Number,
    },
    avgAwayGSPG: {
        type:Number,
    },

});

// Export the Model
module.exports = mongoose.model('GoalsLeague', GoalsLeagueSchema);