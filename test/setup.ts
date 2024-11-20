import { AppDataSource, initializeDataSource } from '../src/config/data-source';

beforeAll(async () => {
  await initializeDataSource();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
