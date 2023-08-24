// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require("../../middleware/async");
const colors = require('colors');
const dotenv = require('dotenv');

// Models & Environment Variables
const Fixture = require('../../models/Fixture');
const Form = require('../../models/Form');
const Poisson = require('../../models/Poisson');
const GoalsLeague = require('../../models/GoalsLeague');
dotenv.config({ path:'./config/config.env' });

exports.createPoissonDistribution = asyncHandler(async() => {

    // Connect to the db
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    function fact(x) {
        if(x == 0) {
            return 1;
        }
        return x * fact(x-1);
    }

    const matches = await Fixture.find({matchStatus: { $nin: ['Match Finished', 'Match Postponed']}});
    
    // Loop over all matches and create a prediction object
    for(var a = 0; a < matches.length; a++) {

        const homeStats = await Form.find({teamName:matches[a].homeTeam}, {avgHomeGoalsScored:1, avgHomeGoalsConceded:1, _id:0});
        const awayStats = await Form.find({teamName:matches[a].awayTeam}, {avgAwayGoalsScored:1, avgAwayGoalsConceded:1, _id:0});
        
        let league = matches[a].competitionID;
        let avgHomeGSPG = await GoalsLeague.find({leagueID:league}, {avgHomeGSPG:1,_id:0});
        let avgAwayGSPG = await GoalsLeague.find({leagueID:league}, {avgAwayGSPG:1,_id:0});

        // Factorisations
        let haf = homeStats[0].avgHomeGoalsScored / avgHomeGSPG[0].avgHomeGSPG;
        let adf = awayStats[0].avgAwayGoalsConceded / avgHomeGSPG[0].avgHomeGSPG;
        let aaf = awayStats[0].avgAwayGoalsScored / avgAwayGSPG[0].avgAwayGSPG;
        let hdf = homeStats[0].avgHomeGoalsConceded / avgAwayGSPG[0].avgAwayGSPG;

        // Goal Projections
        let prhg = haf * adf * avgHomeGSPG[0].avgHomeGSPG;
        let prag = aaf * hdf * avgAwayGSPG[0].avgAwayGSPG;
        let prtg = prhg + prag;

        // Poisson Formula
        const exponential = 2.718281828;
        let prhgNegated = -prhg;
        let homeExpPow = Math.pow(exponential, prhgNegated);

        // Home Distribution
        let homeGoalsDistribution = [];
        for(var b = 0; b < 9; b++) {
            let homeNumerator = Math.pow(prhg,b) * homeExpPow;
            let homeDenominator = fact(b);
            let homeProbability = homeNumerator / homeDenominator;
            let homeResult = {
                goals:b,
                probability:homeProbability,
            }
            homeGoalsDistribution.push({
                homeGoals:homeResult,
            });
        }
        let pragNegated = -prag;
        let awayExpPow = Math.pow(exponential, pragNegated);
        let awayGoalsDistribution = [];
        for(var c = 0; c < 9; c++) {
            let awayNumerator = Math.pow(prag,c) * awayExpPow;
            let awayDenominator = fact(c);
            let awayProbability = awayNumerator / awayDenominator;
            let awayResult = {
                goals:c,
                probability:awayProbability,
            }
            awayGoalsDistribution.push({
                awayGoals:awayResult,
            });
        }

        // Loop All Goals & Multiply Values
        let scoresP = [];
        for(var d = 0; d < awayGoalsDistribution.length; d++) {

            for(var e = 0; e < homeGoalsDistribution.length; e++) {

                let calc = awayGoalsDistribution[d].awayGoals.probability * homeGoalsDistribution[e].homeGoals.probability;

                let calcResult = {
                    score: e + ':' + d,
                    scoreP: calc
                }
                scoresP.push({
                    calcResult
                });

            }
            
        }

        let fixturePrediction = {
            fixtureID:matches[a].fixtureID,
            predictions:scoresP,
        }

        // Check if the record exists
        let filter = { fixtureID: matches[a].fixtureID };
        let exists = await Poisson.exists(filter);

        // If no record, create a new fixture, else update the record
        if(exists === null) {
            await Poisson.create(fixturePrediction);
            console.log(`Poisson Distribution created for fixture ${fixturePrediction.fixtureID}`.green.bold);
        } else {
            await Poisson.findOneAndUpdate(filter,fixturePrediction);
            console.log(`Poisson Distribution udpated for fixture ${fixturePrediction.fixtureID}`.yellow.bold);
        }

    }

});

if(process.argv[2] === '-PD') {
    this.createPoissonDistribution();
}