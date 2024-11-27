import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { userRole } from '../enums/book.enum';
import { hasRole } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';
import { Context } from '../types/context';

@Resolver()
export class UserResolver {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Mutation to log in a user and generate an authentication token.
   * @param {string} emailAddress The email address of the user attempting to log in.
   * @param {string} password The password associated with the user's account.
   * @returns {Promise<string>} A JWT authentication token if the login is successful.
   * @throws {Error} If the email address or password is incorrect, or if the user does not exist.
   */
  @Mutation(() => String)
  async login(
    @Arg('emailAddress') emailAddress: string,
    @Arg('password') password: string,
  ): Promise<string> {
    return this.userService.login(emailAddress, password);
  }

  /**
   * Mutation to log out the currently authenticated user.
   * @param context Context object containing the request and response.
   * @returns A success message.
   */
  @Mutation(() => String)
  @UseMiddleware(hasRole([userRole.BUYER, userRole.MANAGER]))
  async logout(@Ctx() { res }: Context): Promise<string> {
    if (!res) {
      throw new Error('Response object is not available in context');
    }

    return this.userService.logout(res);
  }
}
