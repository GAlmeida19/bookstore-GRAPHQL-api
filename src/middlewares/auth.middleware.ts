import { MiddlewareFn } from 'type-graphql';
import { userRole } from '../enums/book.enum'; // Import your userRole enum
import { Context } from '../types/context';

/**
 * Middleware to check if the user has one of the allowed roles.
 * @param roles - An array of user roles that are allowed to execute the mutation.
 */
export const hasRole = (roles: userRole[]): MiddlewareFn<Context> => {
  return ({ context }, next) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }

    if (!roles.includes(context.user.userRole)) {
      throw new Error(
        'You do not have the required permissions to perform this action',
      );
    }

    return next();
  };
};
