const AuthController = require('../auth.controller');
const AuthService = require('../auth.service');

jest.mock('../auth.service', () => ({
  signup: jest.fn(),
  login: jest.fn(),
  changePassword: jest.fn(),
}));

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user-id' }, 
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should register a user successfully', async () => {
      req.body = { name: 'testuser', email: 'test@test.com', password: 'Test@12345', confirmPassword: 'Test@12345' };
      const mockUser   = { id: 'user-id', username: 'testuser' };
      AuthService.signup.mockResolvedValue(mockUser );
      
      await AuthController.signup(req, res);

      expect(AuthService.signup).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser ,
        message: "Registered successfully",
      });
    });

    it('should handle validation error during signup', async () => {
      req.body = { email: 'test@test.com', password: 'password' }; 
      
      await AuthController.signup(req, res).catch(error => {
        expect(error.message).toEqual('name is required');
      });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      req.body = { email: 'test@test.com', password: 'Test@12345' };
      const mockToken = 'token123';
      const mockUser   = { id: 'user-id', username: 'testuser' };
      AuthService.login.mockResolvedValue({ token: mockToken, user: mockUser  });

      await AuthController.login(req, res);

      expect(AuthService.login).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        user: mockUser ,
        message: "Login successfully",
      });
    });

    it('should handle validation error during login', async () => {
      req.body = { email: '', password: 'password' }; 
      
      await AuthController.login(req, res).catch(error => {
        expect(error.message).toEqual('email is not allowed to be empty');
      });
    });
  });

  describe('changePassword', () => {
    it('should change the password successfully', async () => {
      req.body = { oldPassword: 'oldPassword', newPassword: 'Test@12345', confirmNewPassword: 'Test@12345' };
      AuthService.changePassword.mockResolvedValue();

      await AuthController.changePassword(req, res);

      expect(AuthService.changePassword).toHaveBeenCalledWith(req.user.id, req.body);
      expect(res.json).toHaveBeenCalledWith({ message: "Password changed successfully" });
    });

    it('should handle validation error during changePassword', async () => {
      req.body = { oldPassword: '', newPassword: 'newPassword' }; 
      
      await AuthController.changePassword(req, res).catch(error => {
        expect(error.message).toEqual('oldPassword is not allowed to be empty');
      });
    });
  });
});