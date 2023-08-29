// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require('../../middleware/async');
const colors = require('colors');
const dotenv = require('dotenv');

// Models & Environment Variables
const Form = require('../../models/Form');
dotenv.config({ path:'./config/config.env' });

// Set API Connection Info
const url = 'https://api-football-v1.p.rapidapi.com/v3/teams?league=';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
};

// League IDs to be Updated
const leagues = ['106','107'];

// Fetch the Data
exports.getTeamBasicData = asyncHandler(async() => {

    // Array to store the data
    const teams = [];

    // Console log that the job is starting
    console.log('Team names being created in the form table'.magenta.bold.underline);

    // FETCH each team name from the API
    for(var a = 0; a < leagues.length; a++) {
        // API call URL
        let fetchURL = url + leagues[a] + '&season=2023';
        console.log(fetchURL);
        // Call the API
        const response = await fetch(fetchURL,options);
        const data = await response.json();
        // Unpack the needed data
        const teamData = data.response;
        // Loop over the data and push it to final Array
        for(var b = 0; b < teamData.length; b++) {
            teams.push({
                ...teamData[b],
                league:leagues[a],
            });
        }
    }

    // Map the Data according to Fixture Model
    const importData = teams.map(team => ({
        teamName:team.team.name,
        league:team.league,
    }));

    // Connect to the db
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    // # of Records Created/Updated
    let created = 0;
    let updated = 0;

    // Loop over the data and import it to the db
    for(var c =0; c < importData.length; c++) {
        // Check if the record exists
        let filter = { teamName: importData[c].teamName };
        let exists = await Form.exists(filter);
        // If no record, create a new fixture, else update the record
        if(exists === null) {
            await Form.create(importData[c]);
            created++;
            console.log(`Created Team:  ${importData[c].teamName}`.green.bold);
        } else {
            await Form.findOneAndUpdate(filter,importData[c]);
            updated++;
            console.log(`Updated Team ${importData[c].teamName}`.yellow.bold);
        }
    }

    // Database Import statistics.
    const total = created + updated;
    const diff = importData.length - total;
    console.log(`${created} Documents Created`.green);
    console.log(`${updated} Documents Updated`.yellow);
    console.log(`${total} Total # of Documents`.blue);
    console.log(`${diff} differences in the db update process!`.magenta);

});

if(process.argv[2] === '-TBD') {
    this.getTeamBasicData();
}
