import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/errors.js";
/**
 * REGISTER USER
 * validate - name, email, password with mongoose,
 * hash password with bcrypt
 * save user
 * generate token with jwt
 * save response with token
 */
export const registerUser = async (req, res) => {
  const user = await User.create({
    ...req.body,
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    success: true,
    token,
    msg: "user created successfully",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userId: user._id,
    },
  });
};

// validate email and password- throw errors if missing
// find the user with the id and throw error if not found
// compare the password with the hashed password, throw error if not correct
// generate token with jwt
// return the response with the token included
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide an email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    token,
    msg: "User Login successful",
  });
};
