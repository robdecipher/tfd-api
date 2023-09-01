// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require("../../middleware/async");
const colors = require('colors');
const dotenv = require('dotenv');

// Models & Environment Variables
const Poisson = require('../../models/Poisson');
const Fixture = require('../../models/Fixture');
dotenv.config({ path:'./config/config.env' });

// Over 1.5 & 2.5 Goals Probability Score / 100
exports.createMatchPredictions = asyncHandler(async() => {

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

        // Poisson Match Possibilities
        let homeProbability = 0;
        let awayProbability = 0;
        let drawProbability = 0;
        let pd = matchesInScope[a].predictions;
        for(var b = 0; b < pd.length; b++) {
            if(pd[b].calcResult.score.charAt(0) > pd[b].calcResult.score.charAt(2)) {
                homeProbability += pd[b].calcResult.scoreP;
            } else if(pd[b].calcResult.score.charAt(0) < pd[b].calcResult.score.charAt(2)) {
                awayProbability += pd[b].calcResult.scoreP;
            } else {
                drawProbability += pd[b].calcResult.scoreP;
            }
        }

        // Create final prediction object
        let matchPrediction = {
            fixtureID:matchesInScope[a].fixtureID,
            homeProbability:homeProbability,
            awayProbability:awayProbability,
            drawProbability:drawProbability,
        }

        fixturePredictions.push({
            ...matchPrediction
        });

    }
    
    // Insert Data to the db
    // # of Records Created/Updated
    let noFixture = 0;
    let updated = 0;

    // Loop over the data and import it to the db
    for(var c =0; c < fixturePredictions.length; c++) {
        // Check if the record exists
        let filter = { fixtureID: fixturePredictions[c].fixtureID };
        let exists = await Fixture.exists(filter);
        // If no record, create a new fixture, else update the record
        if(exists === null) {
            noFixture++;
            console.log(`Could not find a fixture record to update for match ${fixturePredictions[c].fixtureID}`.red.bold);
        } else {
            await Fixture.findOneAndUpdate(filter,fixturePredictions[c]);
            updated++;
            console.log(`Updated match predictions for fixture ${fixturePredictions[c].fixtureID}`.blue.bold);
        }
    }

    // Database Import statistics.
    const total = noFixture + updated;
    const diff = fixturePredictions.length - total;
    console.log(`${updated} Updated Predictions`.green);
    console.log(`${noFixture} could not be found.`.yellow);
    console.log(`${total} Total Records processed`.blue);
    console.log(`${diff} differences in the db update process!`.magenta);

});

if(process.argv[2] === '-MP') {
    this.createMatchPredictions();
}