import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { categories } from '../enums/book.enum';
import { Author, Buyer, Rating } from './index';

@ObjectType()
@Entity()
@Unique(['title'])
export class Book {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  publishedDate!: string;

  @Field(() => categories)
  @Column({
    type: 'simple-enum',
    enum: categories,
    default: categories.UNKNOWN,
  })
  category!: categories;

  @Field(() => Int)
  @Column()
  stock!: number;

  @Field(() => Float)
  @Column({ type: 'float' })
  price!: number;

  @Field()
  @Column('text')
  introduction!: string;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true })
  tags!: string[];

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.books)
  author!: Author;

  @Field(() => [Buyer], { nullable: true })
  @ManyToMany(() => Buyer, (buyer) => buyer.books)
  buyers!: Buyer[];

  @Field(() => [Buyer], { nullable: true })
  @ManyToMany(() => Buyer, (buyer) => buyer.books)
  favorites!: Buyer[];

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.book)
  ratings!: Rating[];
}
