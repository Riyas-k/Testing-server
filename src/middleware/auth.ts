import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserPayload } from '../utils/jwt';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      io?: any; // For socket.io
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }

  req.user = decoded;
  next();
};
