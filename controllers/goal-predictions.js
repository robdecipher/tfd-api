// Required Imports
const OverGoals = require('../models/OverGoals');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');

// Time Stamp
const timeNow = new Date().getTime();

// @description     GET All Over 1.5 Goal Predictions
// @route           GET /api/v1/goal-predictions/over-1.5-goals
// @access          Public
exports.getOverOnePointFive = asyncHandler(async (req,res,next) => {
    const predictions = await OverGoals.find({fixtureTime:{'$gte':timeNow}, competitionID:{$nin:[141,79,62,107]}}, {
        _id:0,
        overTwoPointFive:0,
        bothTeamsToScore:0,
    }).sort({fixtureDate:1});
    res.status(200).json({
        success:true,
        count:predictions.length,
        data:predictions
    });
});

// @description     GET All Over 2.5 Goal Predictions
// @route           GET /api/v1/goal-predictions/over-2.5-goals
// @access          Public
exports.getOverTwoPointFive = asyncHandler(async (req,res,next) => {
    const predictions = await OverGoals.find({fixtureTime:{'$gte':timeNow}, competitionID:{$nin:[141,79,62,107]}}, {
        _id:0,
        overOnePointFive:0,
        bothTeamsToScore:0,
    }).sort({fixtureDate:1});
    res.status(200).json({
        success:true,
        count:predictions.length,
        data:predictions
    });
});

// @description     GET All BTTS Predictions
// @route           GET /api/v1/goal-predictions/both-teams-to-score
// @access          Public
exports.getBothTeamsToScore = asyncHandler(async (req,res,next) => {
    const predictions = await OverGoals.find({fixtureTime:{'$gte':timeNow}, competitionID:{$nin:[141,79,62,107]}}, {
        _id:0,
        overOnePointFive:0,
        overTwoPointFive:0,
    }).sort({fixtureDate:1});
    res.status(200).json({
        success:true,
        count:predictions.length,
        data:predictions
    });
});