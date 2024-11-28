import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { User } from "./user.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ default: false })
  isDeleted!: boolean;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items!: CartItem[];

  @OneToOne(() => User, (user: User) => user.cart, { onDelete: "CASCADE" })
  user!: User;
}
