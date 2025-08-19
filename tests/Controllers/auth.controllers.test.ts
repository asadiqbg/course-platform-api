import { register, login, logout, me } from '../../src/controllers/auth';
import User from '../../src/models/User';
import { BadRequestError, UnauthenticatedError } from '../../src/errors';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../src/models/User');

describe('Auth Controller', () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = { name: 'test', email: 'test@test.com', password: 'password' };
      req.body = userData;

      const mockUser = {
        ...userData,
        createToken: jest.fn().mockReturnValue('mockToken')
      };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      await register(req, res, next);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(mockUser.createToken).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('token', 'mockToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({ user: { name: mockUser.name, email: mockUser.email } });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on registration failure', async () => {
      const userData = { name: 'test', email: 'test@test.com', password: 'password' };
      req.body = userData;
      const mockError = new Error('Registration failed');
      (User.create as jest.Mock).mockRejectedValue(mockError);

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('login', () => {
    const loginData = { email: 'test@test.com', password: 'password' };

    it('should login a user successfully', async () => {
      req.body = loginData;

      const mockUser = {
        name: 'test',
        email: loginData.email,
        comparePassword: jest.fn().mockResolvedValue(true),
        createToken: jest.fn().mockReturnValue('mockToken')
      };
      const mockQuery = { select: jest.fn().mockResolvedValue(mockUser) };
      (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(mockQuery.select).toHaveBeenCalledWith('+password');
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
      expect(mockUser.createToken).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('token', 'mockToken', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ user: { name: mockUser.name } });
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if email or password is not provided', async () => {
      req.body = { email: 'test@test.com' }; // Missing password

      await expect(login(req, res, next)).rejects.toThrow(
        new BadRequestError('Please provide credentials')
      );

      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with UnauthenticatedError if user is not found', async () => {
      req.body = loginData;
      const mockQuery = { select: jest.fn().mockResolvedValue(null) };
      (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthenticatedError));
      expect(next.mock.calls[0][0].message).toBe('User not found');
    });

    it('should call next with UnauthenticatedError for incorrect password', async () => {
      req.body = loginData;
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      const mockQuery = { select: jest.fn().mockResolvedValue(mockUser) };
      (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthenticatedError));
      expect(next.mock.calls[0][0].message).toBe('Incorrect password');
    });
  });

  describe('logout', () => {
    it('should log out the user successfully', async () => {
      await logout(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith('token', 'logout', {
        httpOnly: true,
        expires: expect.any(Date)
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ msg: 'user logged out' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return the current user', async () => {
      const mockUser = { userId: '123', name: 'test', role: 'user' };
      req.user = mockUser;

      await me(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
      expect(next).not.toHaveBeenCalled();
    });
  });
});