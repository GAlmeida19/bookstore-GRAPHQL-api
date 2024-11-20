import bcrypt from 'bcryptjs';
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

    // Compare the password with the stored hash
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    console.log(user.userRole);

    // Generate a JWT token
    return generateToken(user.id, user.userRole);
  }
}
