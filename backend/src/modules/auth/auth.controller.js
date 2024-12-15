const asyncHandler = require('express-async-handler');
const AuthService = require('./auth.service');
const { validateSignup, validateLogin, validateChangePassword } = require('./auth.validation');

class AuthController {
  signup = asyncHandler(async (req, res) => {
    const validatedData = validateSignup(req.body);
    const user = await AuthService.signup(validatedData);
    res.status(201).json({
      user,
      message: "Registered successfully"
    });
  });

  login = asyncHandler(async (req, res) => {
    const validatedData = validateLogin(req.body);
    const { token, user } = await AuthService.login(validatedData);
    res.json({ 
      token, 
      user,
      message: "Login successfully" 
    });
  });

  changePassword = asyncHandler(async (req, res) => {
    const validatedData = validateChangePassword(req.body);
    await AuthService.changePassword(req.user.id, validatedData);
    res.json({ message: "Password changed successfully" });
  });
}

module.exports = new AuthController();