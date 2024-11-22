import jwt from 'jsonwebtoken';
import { userRole } from '../enums/book.enum';

const SECRET_KEY = process.env.SECRET_KEY || 'undefined';

export const generateToken = (userId: number, userRole: userRole) => {
  return jwt.sign({ userId, userRole }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (
  token: string,
): { userId: number; userRole: userRole } | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as {
      userId: number;
      userRole: userRole;
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
