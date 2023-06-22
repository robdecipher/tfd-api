// Required Imports
const Fixture = require('../models/Fixture');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');

// @description     GET All Fixtures
// @route           GET /api/v1/fixture-lists
// @access          Public
exports.getFixtureLists = asyncHandler(async (req,res,next) => {
    const fixtures = await Fixture.find();
    res.status(200).json({
        success:true,
        count:fixtures.length,
        data:fixtures
    });
});

// @description     GET an individual Fixture
// @route           GET /api/v1/fixture-lists/:id
// @access          Public
exports.getFixture = asyncHandler(async (req,res,next) => {
    const fixture = await Fixture.findById(req.params.id);
    if(!fixture) {
        return next(new ErrorResponse(`Fixture with the Match ID ${req.params.id} wasn't found!`,404));
    }
    res.status(200).json({
        success:true,
        data:fixture
    });
});

// @description     Create an individual Fixture
// @route           POST /api/v1/fixture-lists/:id
// @access          Private
exports.createFixture = asyncHandler(async (req,res,next) => {
    const fixture = await Fixture.create(req.body);
    res.status(201).json({
        success:true,
        data:fixture
    });
});

// @description     Update an individual Fixture
// @route           PUT /api/v1/fixture-lists/:id
// @access          Private
exports.updateFixture = asyncHandler(async (req,res,next) => {
    const fixture = await Fixture.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    });
    if(!fixture) {
        return next(new ErrorResponse(`Fixture with the Match ID ${req.params.id} wasn't found!`,404));
    }
    res.status(200).json({
        success:true,
        data:fixture
    });
});

// @description     Delete an individual Fixture
// @route           DELETE /api/v1/fixture-lists/:id
// @access          Private
exports.deleteFixture = asyncHandler(async (req,res,next) => {
    const fixture = await Fixture.findByIdAndDelete(req.params.id);
    if(!fixture) {
        return next(new ErrorResponse(`Fixture with the Match ID ${req.params.id} wasn't found!`,404));
    }
    res.status(200).json({
        success:true,
        data:{}
    });
});