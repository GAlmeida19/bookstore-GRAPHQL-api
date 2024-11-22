import jwt from 'jsonwebtoken';
import { userRole } from '../enums/book.enum';

const SECRET_KEY = process.env.SECRET_KEY || 'undefined';

/**
 * Generates a JWT token for a given user ID and role.
 * @param {number} userId - The unique ID of the user.
 * @param {userRole} userRole - The role of the user (e.g., ADMIN, BUYER).
 * @returns {string} A signed JWT token containing the user ID and role, with an expiration of 1 hour.
 */
export const generateToken = (userId: number, userRole: userRole) => {
  return jwt.sign({ userId, userRole }, SECRET_KEY, { expiresIn: '1h' });
};

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {{ userId: number; userRole: userRole } | null}
 * An object containing the user ID and role if the token is valid, otherwise `null`.
 */
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
