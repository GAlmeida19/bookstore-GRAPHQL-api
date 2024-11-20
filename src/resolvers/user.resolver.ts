import { Arg, Mutation, Resolver } from 'type-graphql';
import { UserService } from '../services/user.service';

@Resolver()
export class AuthResolver {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GraphQL Mutation for login
  @Mutation(() => String)
  async login(
    @Arg('emailAddress') emailAddress: string,
    @Arg('password') password: string,
  ): Promise<string> {
    console.log('Attempting to login...');

    return this.userService.login(emailAddress, password);
  }
}
