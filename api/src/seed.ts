import * as mongoose from "mongoose";
import { config } from "./config";
import { seedUsers } from "./seeders/users";
import { seedProducts } from "./seeders/products";

await mongoose.connect(config.DATABASE_URL);

const desiredSeeders: string[] = Bun.argv.slice(2);
for (const name of desiredSeeders) {
  if (name === "users") {
    await seedUsers(100);
  }

  if (name === "products") {
    await seedProducts(100);
  }
}

await mongoose.disconnect();
process.exit(0);
