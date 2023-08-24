// Required Imports
const mongoose = require('mongoose');

// Schema for Over Goals Predictions
const OverGoalsSchema = new mongoose.Schema({

    fixtureID: {
        type:Number,
    },
    homeTeam: {
        type:String,
    },
    awayTeam: {
        type:String,
    },
    competitionID: {
        type:Number,
    },
    competitionName: {
        type:String,
    },
    fixtureDate: {
        type:String,
    },
    fixtureTime: {
        type:String,
    },
    location: {
        type:String,
    },
    overOnePointFive: {
        type:Number,
    },
    overTwoPointFive: {
        type:Number,
    },
    bothTeamsToScore: {
        type:Number,
    },
    avgHomeGoalsScored: {
        type:Number,
    },
    avgHomeGoalsConceded: {
        type:Number,
    },
    avgHomeGPG: {
        type:Number,
    },
    homeGamesScoredRatio: {
        type:Number,
    },
    homeGamesConcededRatio: {
        type:Number,
    },
    avgAwayGoalsScored: {
        type:Number,
    },
    avgAwayGoalsConceded: {
        type:Number,
    },
    avgAwayGPG: {
        type:Number,
    },
    awayGamesScoredRatio: {
        type:Number,
    },
    awayGamesConcededRatio: {
        type:Number,
    },

});

// Export the Model
module.exports = mongoose.model('OverGoal', OverGoalsSchema);