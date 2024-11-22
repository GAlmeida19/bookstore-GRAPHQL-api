import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Buyer } from './buyer.entity';

@ObjectType()
@Entity()
export class Address {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  streetLine1!: string;

  @Field()
  @Column({ default: '' })
  streetLine2!: string;

  @Field()
  @Column({ default: '' })
  city!: string;

  @Field()
  @Column({ default: '' })
  province!: string;

  @Field()
  @Column({ default: '' })
  postalCode!: string;

  @Field({ nullable: true })
  @Column({ default: '' })
  phoneNumber!: string;

  @Field(() => Boolean)
  @Column({ default: false })
  defaultShippingAddress!: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  defaultBillingAddress!: boolean;

  @Field(() => Buyer)
  @ManyToOne(() => Buyer, (buyer) => buyer.addresses)
  buyer!: Buyer;
}
