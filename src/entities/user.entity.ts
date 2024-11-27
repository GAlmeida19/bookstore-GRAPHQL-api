import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { userRole } from '../enums/book.enum';
import { Buyer } from './buyer.entity';
import { Employee } from './employee.entity';
import { Rating } from './rating.entity';

@ObjectType()
@Entity()
@Unique(['emailAddress'])
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  emailAddress!: string;

  @Field()
  @Column()
  password!: string;

  @Field(() => userRole)
  @Column({
    type: 'simple-enum',
    enum: userRole,
    default: userRole.MANAGER,
  })
  userRole!: userRole;

  @OneToOne(() => Buyer, (buyer) => buyer.user)
  buyer?: Buyer;

  @OneToOne(() => Employee, (employee) => employee.user)
  employee?: Employee;

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.user)
  ratings!: Rating[];
}
