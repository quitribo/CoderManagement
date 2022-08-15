const { sendResponse, AppError } = require("../helpers/utils.js");

const Task = require("../models/Task.js");
const User = require("../models/User.js");

const taskController = {};
//Create a task
taskController.createTask = async (req, res, next) => {
  // const info = new User({ ...req.body });
  const info = req.body;

  try {
    //always remember to control your inputs
    if (!info) throw new AppError(402, "Bad Request", "Create Task Error");

    //mongoose query
    const created = await Task.create(info);
    sendResponse(res, 200, true, created, null, "Create Task Success");
  } catch (err) {
    next(err);
  }
};

//Get all task
//locahost:5000/tasks?page=2&limit=10&status=pending&name=wash&order=asc
//sort asc -desc
//locahost:5000/tasks?status=pending.  ---- query
taskController.getAllTasks = async (req, res, next) => {
  // console.log(req.body.name);
  const statusReq = req.body.status || null;
  const description = req.body.description || null;
  const name = req.body.name || "";
  const order =
    req.query.order === "asc" ? 1 : req.query.order === "desc" ? -1 : 1;

  // paging
  let page = req.query.page || 1; //2
  let limit = req.query.limit || 20; //10

  try {
    //filter status
    const listOfFoundCount = await Task.find({
      description: description,
      status: statusReq,
      name: { $regex: name, $options: "i" },
    }).countDocuments(); //51

    const totalPage = Math.ceil(listOfFoundCount / limit); // 6
    const offset = (page - 1) * limit; //10
    const listOfFound = await Task.find({
      status: statusReq,
      description: description,
      name: { $regex: name, $options: "i" }, //case-insensitive
    })
      .skip(offset) //skip first 10
      .limit(limit) //take 10 next
      .sort({ createdAt: order });

    // send response
    console.log(listOfFound);
    sendResponse(
      res,
      200,
      true,
      { listOfFound, totalPage, total: listOfFoundCount, page },
      // listOfFoundCount,
      null,
      "Found list of tasks success"
    );
  } catch (err) {
    next(err);
  }
};

//Update a task
// req = {
//   body: {
//     task:{name, description, status},
//     user:{_id, name, role}
//   },
// };
taskController.updateTaskById = async (req, res, next) => {
  try {
    // empty target and info mean update nothing
    const targetId = req.params.id; //id of task
    const updateInfo = req.body;
    // updateTaskInfo = {
    //   name:"fdfd",
    //   description:"fddfd",
    //   status: "done"
    // },

    // retrieve from backend
    const taskFromDB = await Task.findById(targetId); //task from DB
    // task = {
    //   name:"fdfd",
    //   description:"fddfd",
    //   status: "review"
    // },
    console.log(updateInfo);
    const userFromDB = await User.findById(req.body.employee);

    // Check task exist
    if (!taskFromDB) throw new AppError(404, "Forbidden", "task not found");

    // Check
    if (taskFromDB.status == "archive")
      throw new AppError(402, "Bad Request", "You can not update this task");

    // Check task status & role = employee
    if (
      (taskFromDB.status == "done" ||
        taskFromDB.status == "archive" ||
        updateInfo.status === "done" ||
        updateInfo.status === "archive") &&
      userFromDB.role == "employee"
    )
      throw new AppError(402, "Bad Request", "You can not update this task");

    // what left
    const options = { new: true };
    const updated = await Task.findByIdAndUpdate(targetId, updateInfo, options);
    sendResponse(res, 200, true, updated, null, "Update task success");
  } catch (err) {
    next(err);
  }
};

//Delete task
taskController.deleteTaskById = async (req, res, next) => {
  // retrive id
  const targetId = req.params.id;

  //check
  const taskFromDB = await Task.findById(targetId);
  if (!taskFromDB) throw new AppError(404, "Forbidden", "Task not found");

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  try {
    //mongoose query
    await Task.findByIdAndUpdate(targetId, { isDeleted: true });
    // const updated = await User.findByIdAndDelete(targetId, options);

    sendResponse(res, 200, true, null, null, "Delete task success");
  } catch (err) {
    next(err);
  }
};

//export
module.exports = taskController;
