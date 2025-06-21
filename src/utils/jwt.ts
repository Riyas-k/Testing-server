import jwt from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../models/User';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export const generateToken = (user: IUser): string => {
  const payload: UserPayload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as UserPayload;
  } catch (error) {
    return null;
  }
};
