import { buildSchema } from 'type-graphql';
import { AuthorResolver } from './resolvers/author.resolver';
import { BookResolver } from './resolvers/book.resolver';
import { BuyerResolver } from './resolvers/buyer.resolver';
import { EmployeeResolver } from './resolvers/employee.resolver';
import { AuthResolver } from './resolvers/user.resolver';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      BookResolver,
      AuthorResolver,
      BuyerResolver,
      AuthResolver,
      EmployeeResolver,
    ],
  });

//TODO: create indexs
