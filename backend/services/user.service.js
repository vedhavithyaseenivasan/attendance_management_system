const { User } = require("../models");

//Get user details
const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] },
      order: [["created_at", "DESC"]]
    });
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllUsers
};
