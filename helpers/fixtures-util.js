// Required Imports
const asyncHandler = require('../middleware/async');
const dotenv = require('dotenv');

// Load ENV Variables
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

// Format Date Function
const today = new Date().toISOString().slice(0,10);
console.log(today);

// MLS League ID
const leagues = ['253','479','128','71'];

// Fetch the Data
exports.getFixtureData = asyncHandler(async () => {

    const fixtureData = [];

    for(var i = 0;i < leagues.length; i++) {
        // Build the URL for Fetching
        let getDataUrl = url + leagues[i] + '&season=2023';
        console.log(getDataUrl);
        // Get the Data
        const response = await fetch(getDataUrl, options);
        const data = await response.json();
        // Unpack the needed data
        const unpackedData = data.response;
        // Push data to the final array
        for(var j = 0;j < unpackedData.length;j++) {
            fixtureData.push({
                ...unpackedData[j]
            });
        }
    }

    return fixtureData;

});
