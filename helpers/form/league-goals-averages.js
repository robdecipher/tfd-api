// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require('../../middleware/async');
const colors = require('colors');
const dotenv = require('dotenv');

// Models & Environment Variables
const Form = require('../../models/Form');
const GoalsLeague = require('../../models/GoalsLeague');
dotenv.config({ path:'./config/config.env' });

// League Tables to create
const leagues = [39,40,41,42,43];

exports.updateGoalAverages = asyncHandler(async() => {

    // Connect to the db
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    // Loop over the leagues
    // GET the Team Goals Form Data in Each League
    for(var a = 0; a < leagues.length; a++) {

        const teams = await Form.find({league:leagues[a]},{
            avgHomeGoalsScored:1,
            avgAwayGoalsScored:1,
            _id:0,
        });

        let totalAVGHomeGSPG = 0;
        let totalAVGAwayGSPG = 0;

        for(var b =0; b < teams.length; b++) {
            totalAVGHomeGSPG += teams[b].avgHomeGoalsScored;
            totalAVGAwayGSPG += teams[b].avgAwayGoalsScored;
        }

        avgHomeGSPG = totalAVGHomeGSPG / teams.length;
        avgAwayGSPG = totalAVGAwayGSPG / teams.length;

        const leagueAverages = {
            leagueID:leagues[a],
            avgHomeGSPG:avgHomeGSPG,
            avgAwayGSPG:avgAwayGSPG,
        }

        // Does the record already exist
        let filter = { leagueID:leagueAverages.leagueID };
        let exists = await GoalsLeague.exists(filter);

        // Insert data to the db.
        if(exists === null) {
            // If no record, create a new document
            await GoalsLeague.create(leagueAverages);
            console.log(`${leagues[a]} goal averages created!`);
        } else {
            // If exists, just update
            await GoalsLeague.findOneAndUpdate(filter,leagueAverages);
            console.log(`${leagues[a]} goal averages updated!`.yellow.underline.bold);
        }

    }

});

if(process.argv[2] === '-LGA') {
    this.updateGoalAverages();
}