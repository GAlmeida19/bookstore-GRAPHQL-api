import { buildSchema } from 'type-graphql';
import {
  AuthorResolver,
  BookResolver,
  BuyerResolver,
  EmployeeResolver,
  UserResolver,
} from './resolvers';
import { AddressResolver } from './resolvers/address.resolver';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      BookResolver,
      AuthorResolver,
      BuyerResolver,
      UserResolver,
      EmployeeResolver,
      AddressResolver,
    ],
  });
