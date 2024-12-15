const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const { BadRequestError, UnauthorizedError } = require('../../utils/errors');
const DatabaseUtils = require('../../utils/db.utils');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  async signup(userData) {
    return DatabaseUtils.withTransaction(async (session) => {
      const { name, email, password } = userData; 
      // Find user with exclusive lock to prevent race conditions
      const userExists = await User.findOne({ email })
        .session(session)
        .read('exclusive')
        .lean();

      if (userExists) {
        throw new BadRequestError('User already exists');
      }

      const newUser = await User.updateOne(
        { email },
        { $set: { name, email, password } },
        {
          session,
          upsert: true,
          new: true,
          lock: 'exclusive'
        }
      );

      const token = this.generateToken(newUser._id);
      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token
      };

      return userResponse;
    });
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('password');

    if (!user || !(await User.schema.methods.matchPassword.call(user, password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user._id);
    const userResponse = {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    };
    return userResponse;
  }

  async changePassword(userId, userData) {
    return DatabaseUtils.withTransaction(async (session) => {
      const { oldPassword, newPassword } = userData;
      const userExists = await User.findOne({ _id: userId })
        .select("password")
        .session(session)
        .read('exclusive')
        .lean();

      if (!userExists) {
        throw new BadRequestError(`User does not exists`);
      }
  
      if (!userExists || !(await User.schema.methods.matchPassword.call(userExists, oldPassword))) {
        throw new UnauthorizedError('Incorrect old password');
      }

      await User.updateOne(
        { _id: userId },
        { $set: { password: newPassword } },
        {
          session,
          lock: 'exclusive'
        }
      );
      return true;
    });
  }
}

module.exports = new AuthService();