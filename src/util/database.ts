import { DataSource } from "typeorm";
import { User } from "../models/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  synchronize: true,
  logging: false,
});

export const initializeDB = () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected");
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    })
}
