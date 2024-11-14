import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { categories } from "../../enums/book.enum";
import { Book } from "../book/book.entity";

@ObjectType()
@Entity()
@Unique(["name"])
export class Author {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => Date)
  @Column()
  birth!: Date;

  @Field(() => [categories])
  @Column({
    type: "enum",
    enum: categories,
    array: true,
  })
  categories!: categories[];

  @Field(() => [Book])
  @OneToMany(() => Book, (book) => book.author)
  books!: Book[];
}
