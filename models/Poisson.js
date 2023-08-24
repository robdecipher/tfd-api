// Required Imports
const mongoose = require('mongoose');

// Schema for Match Prediction
const PredictionSchema = new mongoose.Schema({

    fixtureID: {
        type:Number,
        required:true,
    },
    predictions: {
        type:Array,
    },

});

// Export the Model
module.exports = mongoose.model('Prediction', PredictionSchema);