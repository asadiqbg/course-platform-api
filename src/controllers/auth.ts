import { Req, Res, Next } from '../types/aliases';
import User from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';

// Use Req, Res, Next for request handlers, global types for req.user, JWT, errors, and type-safe logic

export const register = async (req: Req, res: Res, next: Next): Promise<void> => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createToken();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Req, res: Res, next: Next): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide credentials');
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthenticatedError('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthenticatedError('Incorrect password');
    }

    const token = user.createToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(StatusCodes.OK).json({ user: { name: user.name } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Req, res: Res, next: Next): Promise<void> => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

export const me = async (req: Req, res: Res, next: Next): Promise<void> => {
  res.status(StatusCodes.OK).json({ user: req.user });
};