import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Order } from "./order.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid") // Automatically generates a UUID as the primary key
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true }) // Enforces unique constraint
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  @JoinColumn() // Specifies that this is the owning side of the relationship
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
