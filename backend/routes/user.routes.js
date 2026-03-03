const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware"); 
const role = require("../middleware/role.middleware"); 
const { getAllUsers } = require("../controllers/user.controller");

//Get Users
router.get("/", auth, role(["HR"]), getAllUsers);

module.exports = router;