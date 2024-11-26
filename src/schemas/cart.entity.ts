import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./cartItem.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid") // Automatically generates a UUID as the primary key
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true }) // A cart has many items
  items: CartItem[];

  @Column({ type: "boolean", default: false }) // Soft delete flag
  isDeleted: boolean;
}
