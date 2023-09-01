// Required Imports
const mongoose = require('mongoose');
const slugify = require('slugify');

// Schema for a Fixture
const FixtureSchema = new mongoose.Schema({

    fixtureID: {
        type:Number
    },
    homeTeam: {
        type:String,
        required:true
    },
    awayTeam: {
        type:String,
        required:true
    },
    slug: {
        type:String
    },
    location: {
        type:String
    },
    competitionID: {
        type:Number,
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
    },
    homeProbability: {
        type:Number,
    },
    awayProbability: {
        type:Number,
    },
    drawProbability: {
        type:Number,
    },
    season: {
        type:String,
    }
});

// Create URL Slug from Home & Away Teams
FixtureSchema.pre('save', function(next) {
    this.slug = slugify(this.homeTeam + '-vs-' + this.awayTeam, { lower:true });
    next();
});

// Create Match Result from Home & Away Goals
FixtureSchema.pre('save', function(next) {
    if(this.matchStatus === 'Match Finished') {
        if(this.homeGoals > this.awayGoals) {
            this.matchResult = 'Home Win';
            next();
        } else if(this.homeGoals < this.awayGoals) {
            this.matchResult = 'Away Win';
            next();
        } else if(this.homeGoals === 0 && this.awayGoals === 0) {
            this.matchResult = 'Nil Nil Draw';
            next();
        } else {
            this.matchResult = 'Score Draw';
            next();
        }
    } else {
        next();
    }
});

// Export the Model
module.exports = mongoose.model('Fixture', FixtureSchema);