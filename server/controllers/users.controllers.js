const { sendResponse, AppError } = require("../helpers/utils.js");

const User = require("../models/User.js");

const userController = {};
//Create a user
userController.createUser = async (req, res, next) => {
  // const info = new User({ ...req.body });
  const info = req.body;

  try {
    //always remember to control your inputs
    if (!info) throw new AppError(402, "Bad Request", "Create User Error");

    //mongoose query
    const created = await User.create(info);
    sendResponse(res, 200, true, created, null, "Create User Success");
  } catch (err) {
    next(err);
  }
};

//Get all user
userController.getAllUsers = async (req, res, next) => {
  // empty filter mean get all
  const filter = { isDeleted: false };
  try {
    //mongoose query
    const listOfFound = await User.find(filter);
    //this to query data from the reference and append to found result.
    sendResponse(
      res,
      200,
      true,
      listOfFound,
      null,
      "Found list of users success"
    );
  } catch (err) {
    next(err);
  }
};

//Update a user
userController.updateUserById = async (req, res, next) => {
  try {
    const userFromDB = await User.findById(req.params.id);
    const updateInfo = req.body;

    // Check task exist
    if (!userFromDB) throw new AppError(404, "Forbidden", "User not found");

    // what left
    const options = { new: true };
    const updated = await User.findByIdAndUpdate(
      userFromDB,
      updateInfo,
      options
    );
    sendResponse(res, 200, true, updated, null, "Update user successfully");
  } catch (err) {
    next(err);
  }
};

//Delete user
userController.deleteUserById = async (req, res, next) => {
  //check
  console.log(req.params);
  const userFromDB = await User.findById(req.params.id);
  if (!userFromDB) throw new AppError(404, "Forbidden", "User not found");

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  try {
    //mongoose query
    await User.findByIdAndUpdate(userFromDB, { isDeleted: true });
    // const updated = await User.findByIdAndDelete(targetId, options);

    sendResponse(res, 200, true, null, null, "Delete user success");
  } catch (err) {
    next(err);
  }
};

//export
module.exports = userController;
