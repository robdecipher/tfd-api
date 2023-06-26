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
    let noUpdate = 0;
    let created = 0;
    let updated = 0;

    // Update the db
    for(let i = 0; i < data.length; i++) {

        // Does the record already exist
        let filter = { fixtureID: data[i].fixtureID };
        let exists = await Fixture.exists(filter);

        // No update needed if the match in the db is already complete
        if(exists !== null && data[i].matchStatus === 'Match Finished') {
            console.log('No Update');
            noUpdate++;
            continue;
        }

        // Insert data to the db.
        if(exists === null) {
            // If no record, create a new document
            await Fixture.create(data[i]);
            created++;
            console.log(`Created Fixture ${data[i].fixtureID}`.green.underline.bold);
        } else {
            // If exists, just update
            await Fixture.updateOne(data[i]);
            updated++;
            console.log(`Updated Fixture ${data[i].fixtureID}`.yellow.underline.bold);
        }

    }

    // Database Import statistics and what happened when the function ran.
    const total = noUpdate + created + updated;
    const diff = allFixtures.length - total;
    console.log(`${created} Documents Created`.green);
    console.log(`${updated} Documents Updated`.magenta);
    console.log(`${noUpdate} Documents Not Updated`.cyan);
    console.log(`${total} Total # of Documents`.blue);
    console.log(`${diff} differences in the db update process!`.red);

});