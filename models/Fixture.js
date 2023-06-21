// Required Imports
const mongoose = require('mongoose');

// Schema for a Fixture
const FixtureSchema = new mongoose.Schema({

    homeTeam: {
        type:String,
        required:true
    },
    awayTeam: {
        type:String,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    competitionID: {
        type:Number,
        required:true
    },
    competitionType: {
        type:String,
        required:true
    },
    competitionName:{
        type:String,
        required:true
    },
    fixtureDate: {
        type:Date,
        required:true
    },
    fixtureTime: {
        type:String,
        required:true
    },
    homeGoals: {
        type:Number
    },
    awayGoals: {
        type:Number
    },
    matchResult: {
        type:String
    },
    matchStatus: {
        type:String
    }

});

// Export the Model
module.exports = mongoose.model('Fixture', FixtureSchema);