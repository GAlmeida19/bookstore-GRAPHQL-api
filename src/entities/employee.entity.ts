import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { employeeRoles } from '../enums/book.enum';
import { User } from './user.entity';

@ObjectType()
@Entity()
@Unique(['emailAddress'])
export class Employee {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  emailAddress!: string;

  @Field()
  @Column()
  address!: string;

  @Field(() => Date)
  @Column()
  birth!: Date;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Field(() => employeeRoles)
  @Column({
    type: 'simple-enum',
    enum: employeeRoles,
    default: employeeRoles.INTERN,
  })
  role!: employeeRoles;

  @Field(() => Int)
  @OneToOne(() => User, (user) => user.employee)
  user!: User;
}
