const { sendResponse, AppError } = require("../helpers/utils.js");
const userApi = require("./user.api.js");
const taskApi = require("./task.api.js");

var express = require("express");
var router = express.Router();

// import taskApi from "./task.api.js";
router.use("/tasks", taskApi);

// import userApi from "./user.api.js";
router.use("/users", userApi);

module.exports = router;
