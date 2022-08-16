const { sendResponse, AppError } = require("../helpers/utils.js");
const userApi = require("./user.api.js");
const taskApi = require("./task.api.js");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).send("Welcome to CoderSchool!");
});

// Adding router and controllers
router.get("/template/:test", async (req, res, next) => {
  const { test } = req.params;
  try {
    //turn on to test error handling
    if (test === "error") {
      throw new AppError(401, "Access denied", "Authentication Error");
    } else {
      sendResponse(
        res,
        200,
        true,
        { data: "template" },
        null,
        "template success"
      );
    }
  } catch (err) {
    next(err);
  }
});

// import taskApi from "./task.api.js";
router.use("/tasks", taskApi);

// import userApi from "./user.api.js";
router.use("/users", userApi);

module.exports = router;
