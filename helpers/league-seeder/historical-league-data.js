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

// Seasons
const seasons = ['2022', '2023'];

// League IDs to be Updated
const leagues = ['106','107'];

// From/To date for query
const startDate = '2021-08-01';
const today = new Date();
today.setDate(today.getDate() - 1);
const endDate = today.toISOString().slice(0,10);

// Fetch the Data
exports.getHistoricalLeagueData = asyncHandler(async() => {

    // Array to store the data
    const fixtureData = [];

    // Console log that the job is starting
    console.log('Fixture results and schedule are being updated'.magenta.bold.underline);

    // FETCH data from the API for each season and league; push it to the array
    for(var a = 0; a < seasons.length; a++) {
        for(var b = 0; b < leagues.length; b++) {
            // API call URL
            let fetchURL = url + leagues[b] + '&season=' + seasons[a] + '&from=' + startDate + '&to=' + endDate;
            console.log(fetchURL);
            // Call the API
            const response = await fetch(fetchURL,options);
            const data = await response.json();
            // Unpack the needed data
            const requiredData = data.response;
            // Loop over the data and push it to final Array
            for(var c = 0; c < requiredData.length; c++) {
                fixtureData.push({
                    ...requiredData[c]
                });
            }
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
    for(var d =0; d < importData.length; d++) {
        // Check if the record exists
        let filter = { fixtureID: importData[d].fixtureID };
        let exists = await Fixture.exists(filter);
        // If no record, create a new fixture, else update the record
        if(exists === null) {
            await Fixture.create(importData[d]);
            created++;
            console.log(`Created Fixture ${importData[d].fixtureID}`.green.bold);
        } else {
            await Fixture.findOneAndUpdate(filter,importData[d]);
            updated++;
            console.log(`Updated Fixture ${importData[d].fixtureID}`.yellow.bold);
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

if(process.argv[2] === '-HU') {
    this.getHistoricalLeagueData();
}
