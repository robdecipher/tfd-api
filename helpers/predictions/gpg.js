// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require("../../middleware/async");
const colors = require('colors');
const dotenv = require('dotenv');

// Models & Environment Variables
const Poisson = require('../../models/Poisson');
const Form = require('../../models/Form');
const Fixture = require('../../models/Fixture');
const OverGoals = require('../../models/OverGoals');
dotenv.config({ path:'./config/config.env' });

// Over 1.5 & 2.5 Goals Probability Score / 100
exports.createGPGPredictions = asyncHandler(async() => {

    // Connect to the db
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    // Array for inserting to the db
    const fixturePredictions = [];

    // Get the matches in scope of prediction
    const matchesInScope = await Poisson.find({},{_id:0,__v:0});
    
    // For each match get the poisson for 1.5 goals
    for(var a = 0; a < matchesInScope.length; a++) {

        // Find the fixture data
        let fixture = await Fixture.find({fixtureID:matchesInScope[a].fixtureID}, {
            _id:0,
            slug:0,
            homeGoals:0,
            awayGoals:0,
            matchStatus:0,
        });

        // Create fixture data for insertion to the db
        let homeTeam = fixture[0].homeTeam;
        let awayTeam = fixture[0].awayTeam;
        let competitionID = fixture[0].competitionID;
        let competitionName = fixture[0].competitionName;
        let fixtureDate = fixture[0].fixtureDate;
        let fixtureTime = fixture[0].fixtureTime;
        let location = fixture[0].location;

        // GET statistics needed for score calculation
        let homeStats = await Form.find({teamName:homeTeam});
        let awayStats = await Form.find({teamName:awayTeam});
        
        // Assign needed calculation variables from form stats
        let homeAVGGS = homeStats[0].avgHomeGoalsScored * homeStats[0].homeGamesScoredRatio;
        let awayAVGGS = awayStats[0].avgAwayGoalsScored * awayStats[0].awayGamesScoredRatio;
        let totalGS = homeAVGGS + awayAVGGS;
        let homeAVGGC = homeStats[0].avgHomeGoalsConceded * homeStats[0].homeGamesConcededRatio;
        let awayAVGGC = awayStats[0].avgAwayGoalsConceded * awayStats[0].awayGamesConcededRatio;
        let totalGC = homeAVGGC + awayAVGGC;

        // Calculations for score / ranking
        // Over 1.5 Goals
        let gsaTwo = 0;
        let gcaTwo = 0;
        if(totalGS >= 2) {
            gsaTwo = 1;
        } else {
            gsaTwo = totalGS / 2;
        }
        if(totalGC >= 2) {
            gcaTwo = 1;
        } else {
            gcaTwo = totalGC / 2;
        }
        let gpgaTwo = (gsaTwo + gcaTwo) / 2;
        // Over 2.5 Goals
        let gsaThree = 0;
        let gcaThree = 0;
        if(totalGS >= 3) {
            gsaThree = 1;
        } else {
            gsaThree = totalGS / 3;
        }
        if(totalGC >= 3) {
            gcaThree = 1;
        } else {
            gcaThree = totalGC / 3;
        }
        let gpgaThree = (gsaThree + gcaThree) / 2;

        // Poisson Over 1.5 & 2.5 Goals
        let psTwo = 0;
        let psThree = 0;
        let pd = matchesInScope[a].predictions;
        for(var b = 0; b < pd.length; b++) {
            if(pd[b].calcResult.score === '0:0' || pd[b].calcResult.score === '1:0' || pd[b].calcResult.score === '0:1') {
                psTwo += 0;
                psThree += 0;
            } else if(pd[b].calcResult.score === '1:1' || pd[b].calcResult.score === '2:0' || pd[b].calcResult.score === '0:2') {
                psTwo += pd[b].calcResult.scoreP;
                psThree += 0;
            } else {
                psTwo += pd[b].calcResult.scoreP;
                psThree += pd[b].calcResult.scoreP;
            }

        }

        // Both Teams to Score
        // Home Goal Factors
        let bttsHome = 0;
        if(homeAVGGS >= 1 && homeAVGGS >= 1) {
            bttsHome = 1;
        } else {
            bttsHome = ((homeAVGGS / 1) + (homeAVGGC / 1)) / 2;
        }

       // Away Goal Factor
       let bttsAway = 0;
        if(awayAVGGS >= 1 && awayAVGGS >= 1) {
            bttsAway = 1;
        } else {
            bttsAway = ((awayAVGGS / 1) + (awayAVGGC / 1)) / 2;
        }

        // Total Factor for calculation
        let bttsTGF = (bttsHome + bttsAway) / 2;

        // Poisson for BTTS
        let bttsPD = 0;
        for(var c = 0; c < pd.length; c++) {
            if(pd[c].calcResult.score.charAt(0) === '0' || pd[c].calcResult.score.charAt(2) === '0') {
                bttsPD += 0;
            } else {
                bttsPD += pd[c].calcResult.scoreP;
            }
        }




        // Prediction Score for Over 1.5 & 2.5 Goals
        let finalScoreTwo = ((psTwo + gpgaTwo) / 2) * 100;
        let finalScoreThree = ((psThree + gpgaThree) / 2) * 100;
        let finalScoreBTTS = ((bttsPD + bttsTGF) / 2) * 100;

        // Create final prediction object
        let goalsPrediction = {
            fixtureID:matchesInScope[a].fixtureID,
            homeTeam:homeTeam,
            awayTeam:awayTeam,
            competitionID:competitionID,
            competitionName:competitionName,
            fixtureDate:fixtureDate.toISOString().slice(0,10),
            fixtureTime:fixtureTime,
            location:location,
            overOnePointFive:finalScoreTwo,
            overTwoPointFive:finalScoreThree,
            bothTeamsToScore:finalScoreBTTS,
            avgHomeGoalsScored:homeStats[0].avgHomeGoalsScored,
            avgHomeGoalsConceded:homeStats[0].avgHomeGoalsConceded,
            avgHomeGPG:homeStats[0].avgHomeGPG,
            homeGamesScoredRatio:homeStats[0].homeGamesScoredRatio,
            homeGamesConcededRatio:homeStats[0].homeGamesConcededRatio,
            avgAwayGoalsScored:awayStats[0].avgAwayGoalsScored,
            avgAwayGoalsConceded:awayStats[0].avgAwayGoalsConceded,
            avgAwayGPG:awayStats[0].avgAwayGPG,
            awayGamesScoredRatio:awayStats[0].awayGamesScoredRatio,
            awayGamesConcededRatio:awayStats[0].awayGamesScoredRatio,
        }

        fixturePredictions.push({
            ...goalsPrediction
        });

    }
    
    // Insert Data to the db
    // # of Records Created/Updated
    let created = 0;
    let updated = 0;

    // Loop over the data and import it to the db
    for(var c =0; c < fixturePredictions.length; c++) {
        // Check if the record exists
        let filter = { fixtureID: fixturePredictions[c].fixtureID };
        let exists = await OverGoals.exists(filter);
        // If no record, create a new fixture, else update the record
        if(exists === null) {
            await OverGoals.create(fixturePredictions[c]);
            created++;
            console.log(`Created OverGoals predictions for fixture ${fixturePredictions[c].homeTeam} vs ${fixturePredictions[c].awayTeam}`.magenta.bold);
        } else {
            await OverGoals.findOneAndUpdate(filter,fixturePredictions[c]);
            updated++;
            console.log(`Updated OverGoals predictions for fixture ${fixturePredictions[c].homeTeam} vs ${fixturePredictions[c].awayTeam}`.blue.bold);
        }
    }

    // Database Import statistics.
    const total = created + updated;
    const diff = fixturePredictions.length - total;
    console.log(`${created} Documents Created`.green);
    console.log(`${updated} Documents Updated`.yellow);
    console.log(`${total} Total # of Documents`.blue);
    console.log(`${diff} differences in the db update process!`.magenta);

});

if(process.argv[2] === '-GPG') {
    this.createGPGPredictions();
}