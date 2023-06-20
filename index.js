// Required Imports
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

// Load Environment Variable
dotenv.config({ path:'./config/config.env'});

// Mount Express
const app = express();

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