import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

export const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.API_SECRET, { expiresIn: 86400 });
  return token;
};
