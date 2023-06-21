// Required Imports
const ErrorResponse = require('../helpers/errorResponse');

// Custom Function to Handle Errors
const errorHandler = (err,req,res,next) => {

    // Unpack the Error Details
    let error = {...err};
    error.message = err.message;

    // Log the Error Name to the Console
    console.log(err.name);

    // Handle Bad Object ID
    if(err.name === 'CastError') {
        const message = `Fixture with the Match ID ${err.value} wasn't found!`;
        error = new ErrorResponse(message,404);
    }

    // Validation Error - Required Data Missing
    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message,400);
    }

    // Catch All other Errors
    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || 'Server Error'
    });

}

// Export the Error Handler
module.exports = errorHandler;