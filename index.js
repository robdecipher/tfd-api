// Required Imports
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const dbConnection = require('./config/db');

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

// Mount Routes
app.use('/api/v1/fixture-lists', fixtures);

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