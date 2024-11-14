import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { categories } from "../../enums/book.enum";
import { Author } from "../author/author.entity";
import { Buyer } from "../buyer/buyer.entity";

@ObjectType()
@Entity()
@Unique(["title"])
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
    type: "simple-enum",
    enum: categories,
    default: categories.UNKNOWN,
  })
  category!: categories;

  @Field(() => Int)
  @Column()
  stock!: number;

  @Field(() => Float)
  @Column({ type: "float" })
  price!: number;

  @Field()
  @Column("text")
  introduction!: string;

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.books)
  author!: Author;

  @Field(() => [Buyer])
  @ManyToMany(() => Buyer, (buyer) => buyer.books)
  @JoinTable()
  buyers!: Buyer[];
}
