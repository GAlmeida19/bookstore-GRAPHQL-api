import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { generateToken } from '../utils/jwtUtils';
export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async login(emailAddress: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { emailAddress } });
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    return generateToken(user.id, user.userRole);
  }

  /**
   * Logs out the user by clearing the session or JWT token.
   * @param res Express Response object to clear cookies if necessary.
   * @returns A success message.
   */
  async logout(res: Response): Promise<string> {
    res.clearCookie('token', { httpOnly: true });
    return 'Successfully logged out';
  }
}
