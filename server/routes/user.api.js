const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUserById,
  deleteUserById,
} = require("../controllers/users.controllers.js");

//Read
router.get("/", getAllUsers);
//Create
router.post("/", createUser);
//Update
router.put("/:id", updateUserById);
//Delete
router.delete("/:id", deleteUserById);

//export
module.exports = router;
