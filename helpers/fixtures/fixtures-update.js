// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require('../../middleware/async');
const colors = require('colors');
const dotenv = require('dotenv');

// Models & Environment Variables
const Fixture = require('../../models/Fixture');
dotenv.config({ path:'./config/config.env' });

// Set API Connection Info
const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
};

// League IDs to be Updated
const leagues = ['39','40','41','42','43','140','141','78','79','61','62'];

// From/To date for query
const today = new Date();
today.setDate(today.getDate() - 1);
const startDate = today.toISOString().slice(0,10);
today.setDate(today.getDate() + 15);
const endDate = today.toISOString().slice(0,10);

// Update the results of yesterdays results and gather next two weeks fixtures
exports.updateResultsAndFixtures = asyncHandler(async() => {

    // Array to store the data
    const fixtureData = [];

    // Console log that the job is starting
    console.log('Fixture results and schedule are being updated'.magenta.bold.underline);

    // FETCH data from the API and push it to the array
    for(var a = 0; a < leagues.length; a++) {
        // API call URL
        let fetchURL = url + leagues[a] + '&season=2023' + '&from=2023-08-24' + '&to=' + endDate;
        console.log(fetchURL);
        // Call the API
        const response = await fetch(fetchURL,options);
        const data = await response.json();
        // Unpack the needed data
        const requiredData = data.response;
        // Loop over the data and push it to final Array
        for(var b = 0; b < requiredData.length; b++) {
            fixtureData.push({
                ...requiredData[b]
            });
        }
    }

    // Map the Data according to Fixture Model
    const importData = fixtureData.map(fixture => ({
        fixtureID:fixture.fixture.id,
        homeTeam:fixture.teams.home.name,
        awayTeam:fixture.teams.away.name,
        location:fixture.fixture.venue.name,
        competitionID:fixture.league.id,
        competitionName:fixture.league.name,
        fixtureDate:fixture.fixture.date,
        fixtureTime:fixture.fixture.timestamp,
        homeGoals:fixture.goals.home,
        awayGoals:fixture.goals.away,
        matchStatus:fixture.fixture.status.long
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
        let filter = { fixtureID: importData[c].fixtureID };
        let exists = await Fixture.exists(filter);
        // If no record, create a new fixture, else update the record
        if(exists === null) {
            await Fixture.create(importData[c]);
            created++;
            console.log(`Created Fixture ${importData[c].fixtureID}`.green.bold);
        } else {
            await Fixture.findOneAndUpdate(filter,importData[c]);
            updated++;
            console.log(`Updated Fixture ${importData[c].fixtureID}`.yellow.bold);
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

if(process.argv[2] === '-FU') {
    this.updateResultsAndFixtures();
}