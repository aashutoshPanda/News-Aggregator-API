import bcrypt from "bcrypt";
import { getUserByEmail, createToken } from "../services/user.js";
import User from "../models/user.js";
/**
 * @desc Login a user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    // no users with that email were found
    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }

    // check if password was valid or not
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // make JWT token
    const token = createToken(user.id);
    res.status(200).send({
      user,
      message: "Login successfull",
      accessToken: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "There was an issue with the server while logging in",
    });
  }
};

/**
 * @desc Register a user
 */
export const register = async (req, res) => {
  try {
    const { fullName, email, role, password } = req.body;
    const user = new User({
      fullName,
      email,
      role,
      password: bcrypt.hashSync(password, 8),
    });
    try {
      await user.validate(); // check if the user document is valid
      await user.save(); // save the user document to the database
    } catch (err) {
      return res.status(400).send(err);
    }
    res.status(200).send({
      user,
      message: "User Registered successfully",
    });
  } catch (err) {
    console.log(err.name, err.code);

    if (err.name === "MongoServerError" && err.code === 11000) {
      const field = err.message
        .match(/index:\s.*\sdup/)[0]
        .split(":")[1]
        .trim();
      return res.status(400).json({ message: `${field} must be unique.` });
    }
    res.status(500).send({
      message: "There was an issue with the server while signup",
    });
  }
};
