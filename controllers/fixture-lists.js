// Required Imports


// @description     GET All Fixtures
// @route           GET /api/v1/fixture-lists
// @access          Public
exports.getFixtureLists = async (req,res,next) => {
    res.status(200).json({
        success:true,
        message:'All fixtures listed'
    });
}

// @description     GET an individual Fixture
// @route           GET /api/v1/fixture-lists/:id
// @access          Public
exports.getFixture = async (req,res,next) => {
    res.status(200).json({
        success:true,
        message:`Fixture ${req.params.id} listed`
    });
}

// @description     Create an individual Fixture
// @route           POST /api/v1/fixture-lists/:id
// @access          Private
exports.createFixture = async (req,res,next) => {
    res.status(200).json({
        success:true,
        message:'New fixture was created in the db'
    });
}

// @description     Update an individual Fixture
// @route           PUT /api/v1/fixture-lists/:id
// @access          Private
exports.updateFixture = async (req,res,next) => {
    res.status(200).json({
        success:true,
        message:`Fixture ${req.params.id} was updated in the db`
    });
}

// @description     Delete an individual Fixture
// @route           DELETE /api/v1/fixture-lists/:id
// @access          Private
exports.deleteFixture = async (req,res,next) => {
    res.status(200).json({
        success:true,
        message:`Fixture ${req.params.id} was deleted in the db`
    });
}