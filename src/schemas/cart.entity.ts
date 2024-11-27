import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItem } from "./cartItem.entity";
@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items!: CartItem[];

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;
}
