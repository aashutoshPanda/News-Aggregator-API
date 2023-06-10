import bcrypt from "bcrypt";
import { getUserByEmail, createToken, createNewUser } from "../services/user.js";
import { UserValidator } from "../helpers/validators.js";
/**
 * @desc Login a user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!UserValidator.allLoginValuesProvided({ email, password })) {
      return res.status(400).send({
        message: "email & password are required",
      });
    }
    const user = await getUserByEmail(email);

    // no users with that email were found
    if (!user) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    // check if password was valid or not
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Incorrect Password!",
      });
    }

    // make JWT token
    const token = createToken(user.id);
    res.status(200).send({
      user,
      message: "Login successful",
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
    if (!UserValidator.allSignupValuesProvided({ fullName, email, role, password })) {
      return res.status(400).send({
        message: "fullName, email, role & password are required",
      });
    }
    const user = await createNewUser({ fullName, email, role, password });

    return res.status(200).send({
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
    return res.status(500).send({
      message: "There was an issue with the server while signup",
    });
  }
};
