// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require('../../middleware/async');
const colors = require('colors');
const dotenv = require('dotenv');

// Models & Environment Variables
const Fixture = require('../../models/Fixture');
const Form = require('../../models/Form');
dotenv.config({ path:'./config/config.env' });

//const LeagueOne = ['Barnsley', 'Blackpool', 'Bolton', 'Bristol Rovers', 'Burton Albion', 'Cambridge United'];

// Update Form of each team Home & Away
exports.updateTeamForm = asyncHandler(async() => {

    // Connect to the db
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    // GET the Teams in Each League
    const teams = await Form.find({},{teamName:1,_id:0});

    
    // Log to the console the job is running
    console.log('Team Form is being updated...'.red.bold.underline);

    for(var a = 0; a < teams.length; a++) {

        // queries
        let homeQuery = {
            'homeTeam': '', 
            'matchStatus': 'Match Finished'
        }
        homeQuery.homeTeam = teams[a].teamName;
        console.log(homeQuery);

        let awayQuery = {
            'awayTeam': '', 
            'matchStatus': 'Match Finished'
        }
        awayQuery.awayTeam = teams[a].teamName;
        console.log(awayQuery);

        const homeData = await Fixture.find(homeQuery).sort({ fixtureDate:-1 }).limit(6);
        const awayData = await Fixture.find(awayQuery).sort({ fixtureDate:-1 }).limit(6);
        
        let hgw = 0;
        let hgl = 0;
        let hgd = 0;
        let hgs = 0;
        let hgc = 0;
        let hngs = 0;
        let hngc = 0;
        let agw = 0;
        let agl = 0;
        let agd = 0;
        let ags = 0;
        let agc = 0;
        let angs = 0;
        let angc = 0;
        

        // Home Form
        for(var b = 0; b < homeData.length; b++) {
            if(homeData[b].matchResult === 'Home Win') {
                hgw++;
            } else if(homeData[b].matchResult === 'Away Win') {
                hgl++;
            } else {
                hgd++;
            }
            hgs += homeData[b].homeGoals;
            hgc += homeData[b].awayGoals;
            if(homeData[b].homeGoals > 0) {
                hngs++;
            }
            if(homeData[b].awayGoals > 0) {
                hngc++;
            }
        }

        let ahgs = hgs / homeData.length;
        let ahgc = hgc / homeData.length;
        let ahgpg = ahgs + ahgc;
        let hgsr = hngs / homeData.length;
        let hgcr = hngc / homeData.length;


        // Away Form
        for(var c = 0; c < awayData.length; c++) {
            if(awayData[c].matchResult === 'Away Win') {
                agw++;
            } else if(awayData[c].matchResult === 'Home Win') {
                agl++;
            } else {
                agd++;
            }
            ags += awayData[c].awayGoals;
            agc += awayData[c].homeGoals;
            if(awayData[c].awayGoals > 0) {
                angs++;
            }
            if(awayData[c].homeGoals > 0) {
                angc++;
            }
        }

        let aags = ags / awayData.length;
        let aagc = agc / awayData.length;
        let aagpg = aags + aagc;
        let agsr = angs / awayData.length;
        let agcr = angc / awayData.length;

        const teamForm = {
            teamName:teams[a].teamName,
            homeGamesPlayed:Number(homeData.length),
            homeGamesWon:Number(hgw),
            homeGamesLost:Number(hgl),
            homeGamesDrawn:Number(hgd),
            homeGoalsScored:Number(hgs),
            homeGoalsConceded:Number(hgc),
            avgHomeGoalsScored:Number(ahgs),
            avgHomeGoalsConceded:Number(ahgc),
            avgHomeGPG:Number(ahgpg),
            numberOfHomeGamesScored:Number(hngs),
            homeGamesScoredRatio:Number(hgsr),
            numberOfHomeGamesConceded:Number(hngc),
            homeGamesConcededRatio:Number(hgcr),
            awayGamesPlayed:Number(awayData.length),
            awayGamesWon:Number(agw),
            awayGamesLost:Number(agl),
            awayGamesDrawn:Number(agd),
            awayGoalsScored:Number(ags),
            awayGoalsConceded:Number(agc),
            avgAwayGoalsScored:Number(aags),
            avgAwayGoalsConceded:Number(aagc),
            avgAwayGPG:Number(aagpg),
            numberOfAwayGamesScored:Number(angs),
            awayGamesScoredRatio:Number(agsr),
            numberOfAwayGamesConceded:Number(angc),
            awayGamesConcededRatio:Number(agcr),
        }

        console.log(teamForm);

        // Does the record already exist
        let filter = { teamName:teams[a].teamName };
        let exists = await Form.exists(filter);

        // Insert data to the db.
        if(exists === null) {
            // If no record, create a new document
            await Form.create(teamForm);
            console.log(`${teams[a].teamName} form created!`);
        } else {
            // If exists, just update
            await Form.findOneAndUpdate(filter,teamForm);
            console.log(`${teams[a].teamName} form updated!`.yellow.underline.bold);
        }

    }

});

if(process.argv[2] === '-GF') {
    this.updateTeamForm();
}