const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AuthService = require('../auth.service');
const User = require('../auth.model');
const DatabaseUtils = require('../../../utils/db.utils');
const { BadRequestError, UnauthorizedError } = require('../../../utils/errors');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../auth.model');
jest.mock('../../../utils/db.utils');

describe('AuthService', () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockUser = {
    _id: mockUserId,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    User.findOne.mockReturnValue({
      session: jest.fn().mockReturnThis(),
      read: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn()
    });

    User.schema = {
      methods: {
        matchPassword: jest.fn()
      }
    };
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const mockToken = 'mockToken123';
      jwt.sign.mockReturnValue(mockToken);

      const token = AuthService.generateToken(mockUserId);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUserId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('signup', () => {
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should create a new user successfully', async () => {
      const mockToken = 'mockToken123';
      const mockNewUser = { ...mockUser, _id: mockUserId };

      User.findOne().lean.mockResolvedValue(null);
      User.updateOne.mockResolvedValue(mockNewUser);
      DatabaseUtils.withTransaction.mockImplementation(cb => cb('mockSession'));
      jwt.sign.mockReturnValue(mockToken);

      const result = await AuthService.signup(signupData);

      expect(User.findOne).toHaveBeenCalledWith({ email: signupData.email });
      expect(User.findOne().session).toHaveBeenCalledWith('mockSession');
      expect(User.updateOne).toHaveBeenCalledWith(
        { email: signupData.email },
        { $set: signupData },
        expect.any(Object)
      );
      expect(result).toEqual({
        _id: mockUserId,
        name: mockNewUser.name,
        email: mockNewUser.email,
        token: mockToken
      });
    });

    it('should throw BadRequestError if user already exists', async () => {
      User.findOne().lean.mockResolvedValue(mockUser);
      DatabaseUtils.withTransaction.mockImplementation(cb => cb('mockSession'));

      await expect(AuthService.signup(signupData))
        .rejects
        .toThrow(BadRequestError);
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should login user successfully', async () => {
      const mockToken = 'mockToken123';
      const mockUserWithPassword = {
        ...mockUser
      };

      User.schema.methods.matchPassword.mockResolvedValue(true);
      User.findOne().select.mockResolvedValue(mockUserWithPassword);
      jwt.sign.mockReturnValue(mockToken);

      const result = await AuthService.login(loginData);

      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(User.schema.methods.matchPassword).toHaveBeenCalledWith(loginData.password);
      expect(result).toEqual({
        token: mockToken,
        user: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    });

    it('should throw UnauthorizedError for invalid credentials', async () => {
      const mockUserWithPassword = {
        ...mockUser
      };

      User.schema.methods.matchPassword.mockResolvedValue(false);
      User.findOne().select.mockResolvedValue(mockUserWithPassword);

      await expect(AuthService.login(loginData))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });

  describe('changePassword', () => {
    const changePasswordData = {
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123'
    };

    it('should change password successfully', async () => {
      const mockUserWithPassword = {
        ...mockUser
      };

      User.schema.methods.matchPassword.mockResolvedValue(true);
      User.findOne().lean.mockResolvedValue(mockUserWithPassword);
      User.updateOne.mockResolvedValue({ acknowledged: true });
      DatabaseUtils.withTransaction.mockImplementation(cb => cb('mockSession'));

      const result = await AuthService.changePassword(mockUserId, changePasswordData);

      expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
      expect(User.findOne().session).toHaveBeenCalledWith('mockSession');
      expect(User.schema.methods.matchPassword).toHaveBeenCalledWith(changePasswordData.oldPassword);
      expect(User.updateOne).toHaveBeenCalledWith(
        { _id: mockUserId },
        { $set: { password: changePasswordData.newPassword } },
        expect.any(Object)
      );
      expect(result).toBe(true);
    });

    it('should throw BadRequestError if user does not exist', async () => {
      User.findOne().lean.mockResolvedValue(null);
      DatabaseUtils.withTransaction.mockImplementation(cb => cb('mockSession'));

      await expect(AuthService.changePassword(mockUserId, changePasswordData))
        .rejects
        .toThrow(BadRequestError);
    });

    it('should throw UnauthorizedError for incorrect old password', async () => {
      const mockUserWithPassword = {
        ...mockUser
      };

      User.schema.methods.matchPassword.mockResolvedValue(false);
      User.findOne().lean.mockResolvedValue(mockUserWithPassword);
      DatabaseUtils.withTransaction.mockImplementation(cb => cb('mockSession'));

      await expect(AuthService.changePassword(mockUserId, changePasswordData))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });
});