import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "node_postgres",
  // Syncronize would be set to false in production
  synchronize: true,
  logging: true,
  entities: [__dirname + "/../schemas/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
});

export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    console.log("PostgreSQL connected!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
};
