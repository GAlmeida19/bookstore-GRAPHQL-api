import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Book } from './book.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
@Unique(['user', 'book'])
export class Rating {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'float' })
  value!: number;

  @Field()
  @Column({ type: 'text', nullable: true })
  review?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user!: User;

  @Field(() => Book)
  @ManyToOne(() => Book, (book) => book.ratings, { onDelete: 'CASCADE' })
  book!: Book;
}
