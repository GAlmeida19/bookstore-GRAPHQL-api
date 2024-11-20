import request from 'supertest';
import { app } from '../../src/index';

describe('Author E2E Tests', () => {
  it('should return true for a placeholder test', () => {
    expect(true).toBe(true);
  });
  it('should verify GraphQL endpoint is reachable', async () => {
    const response = await request(app).get('/graphql');
    expect(response.status).toBe(200);
  });

  it('should create a new author', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createAuthor(
              name: "Jane Austen",
              birth: "1775-12-16",
              categories: [FICTION, CLASSIC]
            ) {
              id
              nameImproper Database Connection Handling: There's a failure in establishing or tearing down the database connection during the tests.
              birth
              categories
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.createAuthor).toBeDefined();
    expect(response.body.data.createAuthor.name).toBe('Jane Austen');
  });

  // Additional tests...
});
