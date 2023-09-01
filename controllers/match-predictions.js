// Required Imports
const Fixture = require('../models/Fixture');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');

// @description     GET All Match Predictions
// @route           GET /api/v1/match-predictions
// @access          Public
exports.getMatchPredictions = asyncHandler(async (req,res,next) => {
    const fixtures = await Fixture.find({matchStatus:{$nin:['Match Finished','Match Postponed']}}, {_id:0});
    res.status(200).json({
        success:true,
        count:fixtures.length,
        data:fixtures
    });
});