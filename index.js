// Required Imports
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');
const nodeCron = require('node-cron');
const dbConnection = require('./helpers/db/db');
const errorHandler = require('./middleware/error');

// Load Environment Variable
dotenv.config({ path:'./config/config.env'});

// Connect to the db
dbConnection();

// Import Routes
const fixtures = require('./routes/fixture-lists');
const goalPredictions = require('./routes/goal-predictions');

// Mount Express
const app = express();

// Body Parser
app.use(express.json());

// Development Console Log Middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/v1/fixture-lists', fixtures);
app.use('/api/v1/goal-predictions', goalPredictions);

// CORS
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://labs.thefootballdirective.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

// Error Handling
app.use(errorHandler);

// Fetch Fixture Data Cron Job
console.log('CRON jobs will be added later');
/*const job = nodeCron.schedule("5 23 * * *", () => {
    console.log('CRON Job is starting!');
    importFixtureData.importFixtureData();
});

const goalsForm = nodeCron.schedule("8 13 * * *", () => {
    console.log('CRON Job is starting!');
    updateTeamForm.updateTeamForm();
});*/

// App Listener & PORT
const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT, console.log(`Server is running in ${process.env.NODE_ENV} on PORT ${PORT}`.magenta.bold)
);

// Unhandled Promise Rejections Handler
process.on('unHandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
});