import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity() // Mark this class as a database entity
export class Product {
  @PrimaryGeneratedColumn("uuid") // Automatically generates a UUID as the primary key
  id!: string;

  @Column({ type: "varchar", length: 255 }) // Product title with a max length of 255 characters
  title!: string;

  @Column({ type: "text" }) // Product description
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 }) // Product price with precision and scale
  price!: number;
}
