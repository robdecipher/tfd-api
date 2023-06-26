// Required Imports
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const nodeCron = require('node-cron');
const dbConnection = require('./config/db');
const errorHandler = require('./middleware/error');
const importFixtureData = require('./helpers/db-importer');

// Load Environment Variable
dotenv.config({ path:'./config/config.env'});

// Connect to the db
dbConnection();

// Import Routes
const fixtures = require('./routes/fixture-lists');

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

// Error Handling
app.use(errorHandler);

// Fetch Fixture Data Cron Job
const job = nodeCron.schedule("0 5 5 * * *", () => {
    console.log('CRON Job is starting!');
    importFixtureData.importFixtureData();
});

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