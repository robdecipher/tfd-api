// Required Imports
const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({

    teamName: {
        type:String,
        required:true,
    },
    league: {
        type:String,
    },
    homeGamesPlayed: {
        type:Number,
    },
    homeGamesWon: {
        type:Number,
    },
    homeGamesLost: {
        type:Number,
    },
    homeGamesDrawn: {
        type:Number,
    },
    homeGoalsScored: {
        type:Number,
    },
    homeGoalsConceded: {
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
    numberOfHomeGamesScored: {
        type:Number,
    },
    homeGamesScoredRatio: {
        type:Number,
    },
    numberOfHomeGamesConceded: {
        type:Number,
    },
    homeGamesConcededRatio: {
        type:Number,
    },
    awayGamesPlayed: {
        type:Number,
    },
    awayGamesWon: {
        type:Number,
    },
    awayGamesLost: {
        type:Number,
    },
    awayGamesDrawn: {
        type:Number,
    },
    awayGoalsScored: {
        type:Number,
    },
    awayGoalsConceded: {
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
    numberOfAwayGamesScored: {
        type:Number,
    },
    awayGamesScoredRatio: {
        type:Number,
    },
    numberOfAwayGamesConceded: {
        type:Number,
    },
    awayGamesConcededRatio: {
        type:Number,
    },
    promoted: {
        type:Boolean,
    },
    relegated: {
        type:Boolean,
    },
    homeLastSeasonGames: {
        type:Number,
    },
    awayLastSeasonGames: {
        type:Number,
    },
});

// Calculate average scored & conceded
/*FormSchema.pre('save', function(next) {
    this.avgHomeGoalsScored = this.homeGoalsScored / this.homeGamesPlayed;
    this.avgHomeGoalsConceded = this.homeGoalsConceded / this.homeGamesPlayed;
    this.avgHomeGPG = this.avgHomeGoalsScored + this.avgHomeGoalsConceded;
    this.homeGamesScoredRatio = this.numberOfHomeGamesScored / this.homeGamesPlayed;
    this.homeGamesConcededRatio = this.numberOfHomeGamesConceded / this.homeGamesPlayed;
    this.avgAwayGoalsScored = this.awayGoalsScored / this.awayGamesPlayed;
    this.avgAwayGoalsConceded = this.awayGoalsConceded / this.awayGamesPlayed;
    this.avgAwayGPG = this.avgAwayGoalsScored + this.avgAwayGoalsConceded;
    this.awayGamesScoredRatio = this.numberOfAwayGamesScored / this.awayGamesPlayed;
    this.awayGamesConcededRatio = this.numberOfAwayGamesConceded / this.awayGamesPlayed;
    next();
});*/

module.exports = mongoose.model('Form', FormSchema);