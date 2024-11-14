import express from "express";
import { graphqlHTTP } from "express-graphql";
import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { createSchema } from "./schema";

async function main() {
  await AppDataSource.initialize();
  const schema = await createSchema();

  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );

  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000/graphql");
  });
}

main().catch((error) => console.error(error));
