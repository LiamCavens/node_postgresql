import { AppDataSource } from "../config/data-source";
import { Product } from "../schemas/product.entity";

const seedProducts = async () => {
  try {
    const products = [
      {
        title: "Book",
        description: "A very interesting book",
        price: 100,
      },
      {
        title: "Laptop",
        description: "A powerful laptop for developers",
        price: 1500,
      },
      {
        title: "Phone",
        description: "A smartphone with great camera features",
        price: 800,
      },
    ];

    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Clear existing products and dependent records
    await queryRunner.query('TRUNCATE TABLE "product" CASCADE');

    const productRepository = AppDataSource.getRepository(Product);
    const productEntities = productRepository.create(products);
    await productRepository.save(productEntities);

    await queryRunner.commitTransaction();
    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await AppDataSource.destroy();
  }
};

seedProducts();
