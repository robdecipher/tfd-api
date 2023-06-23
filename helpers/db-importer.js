// Required Imports
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');
const colors = require('colors');

// Data from Fixtures Utility & Fixture Model
const getFixtureData = require('./fixtures-util');
const Fixture = require('../models/Fixture');

// Import Fixture Data to the db
exports.importFixtureData = asyncHandler(async() => {

    // Log that the import is starting
    console.log('db Import Job is running...'.green.underline.bold);

    // GET the data from Fixture Util
    const allFixtures = await getFixtureData.getFixtureData();

    // Map the Data according to Fixture Model
    const data = allFixtures.map(fixture => ({
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

    //console.log(data);

    // Connect to the db
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    // # of Records Update
    let success = 0;

    // Update the db
    for(let i = 0; i < data.length; i++) {

        let filter = { fixtureID: data[i].fixtureID };
        let options = { upsert:true };

        let exists = await Fixture.exists(filter);

        if(exists === null) {
            await Fixture.create(data[i]);
            console.log(`Created Fixture ${data[i].fixtureID}`.green.underline.bold);
        } else {
            await Fixture.updateOne(data[i]);
            console.log(`Updated Fixture ${data[i].fixtureID}`.yellow.underline.bold);
        }
        success++;

    }

    // Validate the number of records updated vs. data supplied
    if(success === allFixtures.length) {
        console.log(colors.green.inverse.bold(success + ' fixtures were updated in the db!'));
    } else {
        const diff = allFixtures.length - success;
        console.log(colors.red.inverse.bold(diff + ' fixtures were not updated in the db!'));
    }


});