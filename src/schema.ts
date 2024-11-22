import { buildSchema } from 'type-graphql';
import {
  AuthorResolver,
  BookResolver,
  BuyerResolver,
  EmployeeResolver,
  UserResolver,
} from './resolvers';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      BookResolver,
      AuthorResolver,
      BuyerResolver,
      UserResolver,
      EmployeeResolver,
    ],
  });
