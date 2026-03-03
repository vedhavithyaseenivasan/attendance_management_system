const { getAllUsers: getAllUsersService } = require("../services/user.service");

//Get User Details
const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error("User Controller Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers
};