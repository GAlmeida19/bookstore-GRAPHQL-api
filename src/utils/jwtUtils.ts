import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key'; // Make sure to store this in an environment variable

// Generate a JWT token
export const generateToken = (userId: number, userRole: string) => {
  return jwt.sign({ userId, userRole }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (
  token: string,
): { userId: number; userRole: string } | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as {
      userId: number;
      userRole: string;
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
