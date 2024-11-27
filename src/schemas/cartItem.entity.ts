import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  product!: Product; // Storing productId instead of a relation to Product

  @Column()
  count!: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cartId" })
  cart!: Cart;
}
