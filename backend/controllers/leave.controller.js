const leaveService = require("../services/leave.service");
const { User } = require("../models");

//Apply leave
exports.applyLeave = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const result = await leaveService.applyLeave(user, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

//Get own leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const leaves = await leaveService.getMyLeaves(user);
    res.json(leaves);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

//Get team leaves
exports.getTeamLeaves = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const leaves = await leaveService.getTeamLeaves(user);
    res.json(leaves);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

//Update leave status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const result = await leaveService.updateLeaveStatus(
      user,
      req.params.id,
      req.body.status
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

















// //Delete leave
// exports.deleteLeave = async (user, leaveId) => {
//   //Calls service function directly
//   return await leaveService.deleteLeave(user, leaveId);
// };