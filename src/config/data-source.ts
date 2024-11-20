import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Author } from '../entities/author/author.entity';
import { Book } from '../entities/book/book.entity';
import { Buyer } from '../entities/buyer/buyer.entity';
import { Employee } from '../entities/employee.entity';
import { User } from '../entities/user.entity';
dotenv.config();

//TODO: ADD ENTITYS
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Book, Author, Buyer, User, Employee],
  synchronize: true,
  // logging: true,
});

//TODO: ADICIONAR INDEXS

export async function initializeDataSource(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}
