// Required Imports
const mongoose = require('mongoose');

// DB Connection Function
const dbConnection = async () => {

    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    console.log(`db Connected: ${connection.connection.host}`.cyan.underline.bold);

}

// Export the Function
module.exports = dbConnection;