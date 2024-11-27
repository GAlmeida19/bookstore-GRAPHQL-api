import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Address } from './address.entity';
import { Book } from './book.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
@Unique(['emailAddress'])
export class Buyer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field()
  @Column()
  emailAddress!: string;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Field(() => Date)
  @Column()
  birth!: Date;

  @Field(() => Float)
  @Column({ type: 'float' })
  wallet!: number;

  @OneToOne(() => User, (user) => user.employee, { cascade: true, eager: true })
  @JoinColumn()
  user!: User;

  @Field(() => [Book], { nullable: true })
  @ManyToMany(() => Book, (book) => book.buyers)
  @JoinTable({ name: 'buyer_purchased_books' })
  books!: Book[];

  @Field(() => [Book], { nullable: true })
  @ManyToMany(() => Book, (book) => book.favorites)
  @JoinTable({ name: 'buyer_wishlist' })
  wishlist!: Book[];

  @Field(() => [Address])
  @OneToMany(() => Address, (address) => address.buyer)
  addresses!: Address[];
}
