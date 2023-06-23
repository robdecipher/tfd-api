// Required Imports
const asyncHandler = require('../middleware/async');
const dotenv = require('dotenv');

// Load ENV Variables
dotenv.config({ path:'./config/config.env' });

// Set API Connection Info
const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?date=';
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

// Final URL
const urlFinal = url + today;
console.log(urlFinal);


// Fetch the Data
exports.getFixtureData = asyncHandler(async () => {

    const response = await fetch(urlFinal,options);
    const data = await response.json();

    const unpackedData = data.response;

    const fixtureData = [];


    for(i=0;i<unpackedData.length;i++) {
        fixtureData.push({
            ...unpackedData[i]
        });
    }

    return fixtureData;

});
