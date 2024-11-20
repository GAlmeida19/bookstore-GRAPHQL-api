// middleware/authMiddleware.ts

import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types/context';

export const RoleMiddleware: (requiredRole: string) => MiddlewareFn<Context> =
  (requiredRole) =>
  async ({ context }, next) => {
    const { user } = context;

    console.log('User in context:', user);

    if (!user) {
      throw new Error('Not authenticated');
    }

    if (user.userRole !== requiredRole) {
      throw new Error('Insufficient permissions');
    }

    return next();
  };
