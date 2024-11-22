import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
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

  @OneToOne(() => User, (user) => user.employee, { cascade: true, eager: true }) // Owner side
  @JoinColumn() // Adds a foreign key in Employee table
  user!: User;

  @Field(() => [Book])
  @ManyToMany(() => Book, (book) => book.buyers)
  books!: Book[];

  @Field(() => [Address])
  @OneToMany(() => Address, (address) => address.buyer)
  addresses!: Address[];
}
