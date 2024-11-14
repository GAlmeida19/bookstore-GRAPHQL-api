import { buildSchema } from "type-graphql";
import { AuthorResolver } from "./resolvers/author.resolver";
import { BookResolver } from "./resolvers/book.resolver";
import { BuyerResolver } from "./resolvers/buyer.resolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [BookResolver, AuthorResolver, BuyerResolver],
  });
