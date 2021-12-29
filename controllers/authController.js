const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { attachCookies, createTokenUser } = require("../utils");
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new BadRequestError("Email already exists");
  }

  //first user becomes an Admin
  const isFirstAccount = (await User.countDocuments({})) == 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user);
  //   const token = user.createJWT();
  const token = createJWT({ payload: tokenUser });
  //   res.status(StatusCodes.CREATED).json({ user: { name: tokenUser }, token });
  attachCookies({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  attachCookies({ res, user: tokenUser });
  res.status(201).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.status(201).json({ msg: "User logged out" });
};

module.exports = {
  register,
  login,
  logout,
};
