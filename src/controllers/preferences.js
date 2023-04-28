/**
 * @desc set preferences for a user
 */
export const setPreferences = async (req, res) => {
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
    const token = createToken();
    res.status(200).send({
      user,
      message: "Login successfull",
      accessToken: token,
    });
  } catch (err) {
    return res.status(500).send({
      message: "There was an issue with the server while logging in",
    });
  }
};

/**
 * @desc Update preferences for a user
 */
export const updatePreferences = async (req, res) => {
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
    const token = createToken();
    res.status(200).send({
      user,
      message: "Login successfull",
      accessToken: token,
    });
  } catch (err) {
    return res.status(500).send({
      message: "There was an issue with the server while logging in",
    });
  }
};
