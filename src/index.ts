import express, { Request, Response } from 'express';
import { Options, graphqlHTTP } from 'express-graphql';
import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { createSchema } from './schema';
import { Context } from './types/context';
import { verifyToken } from './utils/jwtUtils';

export const app = express();

async function main() {
  await AppDataSource.initialize();
  const schema = await createSchema();

  app.use('/graphql', (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    const user = token ? verifyToken(token) : null;

    console.log('Decoded User Info:', user);

    const context: Context = {
      req,
      res,
      user: user ? { userId: user.userId, userRole: user.userRole } : undefined,
    };

    const options: Options = {
      schema,
      graphiql: true,
      context,
    };

    return graphqlHTTP(options)(req, res);
  });

  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql');
  });
}

main().catch((error) => console.error(error));
