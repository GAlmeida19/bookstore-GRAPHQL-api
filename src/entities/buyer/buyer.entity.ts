import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Book } from '../book/book.entity';
import { User } from '../user.entity';

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

  @Field()
  @Column()
  address!: string;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Field(() => Date)
  @Column()
  birth!: Date;

  @Field(() => Float)
  @Column({ type: 'float' })
  wallet!: number;

  @OneToOne(() => User, (user) => user.buyer)
  user?: User;

  @Field(() => [Book])
  @ManyToMany(() => Book, (book) => book.buyers)
  books!: Book[];

  // @OneToMany(type => Address, address => address.customer)
  //   addresses: Address[];

  // @OneToOne(type => User, { eager: true })
  //   @JoinColumn()
  //   user?: User;
}

//TODO: add entity address? relate to employee
