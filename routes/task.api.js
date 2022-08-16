const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/tasks.controllers.js");

//Read
router.get("/", getAllTasks);
//Create
router.post("/", createTask);
//Update
router.put("/:id", updateTaskById);
//Delete
router.delete("/:id", deleteTaskById);

//export
module.exports = router;
