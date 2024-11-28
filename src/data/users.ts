import { AppDataSource } from "../config/data-source";
import { User } from "../schemas/user.entity";

const seedUsers = async () => {
  try {
    const users = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123", // Ideally, this should be hashed
      },
      {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password1234",
      },
      {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        password: "password1235",
      },
    ];

    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Clear existing users and dependent records
    await queryRunner.query('TRUNCATE TABLE "user" CASCADE');

    const userRepository = AppDataSource.getRepository(User);
    const userEntities = userRepository.create(users);
    await userRepository.save(userEntities);

    await queryRunner.commitTransaction();
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await AppDataSource.destroy();
  }
};

seedUsers();
