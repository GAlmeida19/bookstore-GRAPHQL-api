// index.ts

import express, { Request } from 'express';
import { graphqlHTTP } from 'express-graphql';
import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { createSchema } from './schema';
import { Context } from './types/context';
import { verifyToken } from './utils/jwtUtils';

export const app = express();

async function main() {
  await AppDataSource.initialize();
  const schema = await createSchema();

  app.use(
    '/graphql',
    graphqlHTTP((req) => {
      // Cast req to Express's Request type
      const expressReq = req as Request;

      console.log('Authorization Header:', expressReq.headers.authorization);

      const token = expressReq.headers.authorization?.split(' ')[1];

      console.log('Extracted Token:', token);

      const user = token ? verifyToken(token) : null;

      console.log('Decoded User Info:', user);

      const context: Context = {
        req: expressReq,
        user: user
          ? { userId: user.userId, userRole: user.userRole }
          : undefined,
      };

      return {
        schema,
        graphiql: true,
        context,
      };
    }),
  );

  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql');
  });
}

main().catch((error) => console.error(error));
