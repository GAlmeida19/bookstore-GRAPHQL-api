import { GraphQLSchema, graphql } from 'graphql';
import { buildSchema } from 'type-graphql';
import { AppDataSource, initializeDataSource } from '../../config/data-source';
import { AuthorResolver } from '../../resolvers/author.resolver';
import {
  AuthorResponse,
  CREATE_AUTHOR,
  DELETE_AUTHOR,
  GET_ALL_AUTHORS,
  GET_ONE_AUTHOR,
  UPDATE_AUTHOR,
} from './graphql/author.definitions';

//TODO: CREATE NEW DATABASE AND DESTROY IT AFTER
const cleanDatabase = async () => {
  if (AppDataSource.isInitialized) {
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
};

beforeAll(async () => {
  await initializeDataSource();
  await cleanDatabase();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('AuthorResolver', () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await buildSchema({
      resolvers: [AuthorResolver],
    });
  });

  let createdAuthorId: number;
  describe('Create and Update Authors', () => {
    it('should create a new author', async () => {
      const result = (await graphql({
        schema,
        source: CREATE_AUTHOR,
        contextValue: { dataSource: AppDataSource },
      })) as AuthorResponse;

      console.log(result);

      createdAuthorId = result.data.createAuthor.id;
      expect(result.data?.createAuthor.name).toBe('Mark Twain');
    });

    it('should not let a new author with the same name', async () => {
      const result = (await graphql({
        schema,
        source: CREATE_AUTHOR,
        contextValue: { dataSource: AppDataSource },
      })) as unknown as { errors: Array<{ message: string }>; data: null };

      expect(result.errors[0].message).toContain(
        'duplicate key value violates unique constraint',
      );
    });

    it('should update a created author', async () => {
      const authorId = createdAuthorId;
      const result = (await graphql({
        schema,
        source: UPDATE_AUTHOR(authorId, 'George Orwell'),
        contextValue: { dataSource: AppDataSource },
      })) as AuthorResponse;

      expect(result.data?.updateAuthor.name).toBe('George Orwell');
    });

    it('cannot find id author to update', async () => {
      const authorId = 11;
      const result = (await graphql({
        schema,
        source: UPDATE_AUTHOR(authorId, 'George Orwell'),
        contextValue: { dataSource: AppDataSource },
      })) as unknown as { errors: Array<{ message: string }>; data: null };

      expect(result.errors[0].message).toContain('Author not found');
    });
  });

  describe('retrieve Author(s)', () => {
    it('should retrieve one author by id', async () => {
      const result = (await graphql({
        schema,
        source: GET_ONE_AUTHOR(createdAuthorId),
        contextValue: { dataSource: AppDataSource },
      })) as AuthorResponse;

      expect(result.data?.getAuthorById.name).toBe('George Orwell');
    });

    it('should return null  because it does not exist', async () => {
      const result = (await graphql({
        schema,
        source: GET_ONE_AUTHOR(1000),
        contextValue: { dataSource: AppDataSource },
      })) as AuthorResponse;

      expect(result.data?.getAuthorById).toBe(null);
    });

    it('should retrieve all authors', async () => {
      const result = (await graphql({
        schema,
        source: GET_ALL_AUTHORS,
        contextValue: { dataSource: AppDataSource },
      })) as AuthorResponse;

      expect(result.data?.getAllAuthors).toHaveLength(1);
      expect(result.data?.getAllAuthors[0].name).toBe('George Orwell');
    });
  });

  describe('delete Author(s)', () => {
    it('should delete one author', async () => {
      const result = (await graphql({
        schema,
        source: DELETE_AUTHOR(createdAuthorId),
        contextValue: { dataSource: AppDataSource },
      })) as AuthorResponse;

      expect(result.data?.deleteAuthor).toBe(true);
    });

    it('should return error deleting an author that does not exist', async () => {
      const result = (await graphql({
        schema,
        source: DELETE_AUTHOR(createdAuthorId),
        contextValue: { dataSource: AppDataSource },
      })) as unknown as { errors: Array<{ message: string }>; data: null };

      expect(result.errors[0].message).toContain(
        'Author not found or already deleted',
      );
    });
  });
});
