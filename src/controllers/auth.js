import User from '../models/User';

/**
 * @desc Login a user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({
      error: { message: 'You have entered an invalid email or password' },
    });
  }
};

/**
 * @desc Register a user
 */
export const register = async (req, res) => {
  // const { user } = req;
  // try {
  //   user.tokens = user.tokens.filter(token => {
  //     return token.token !== req.token;
  //   });
  //   await user.save();
  //   res.send({ message: 'You have successfully logged out!' });
  // } catch (e) {
  //   res.status(400).send(e);
  // }
};
