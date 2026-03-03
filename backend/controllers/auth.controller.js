const authService = require("../services/auth.service");

//Change Password
exports.changePassword = async (req, res) => {
  try {
    const result = await authService.changePassword(req.body);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};
