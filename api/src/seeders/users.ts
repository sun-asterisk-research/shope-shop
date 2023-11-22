import { faker } from "@faker-js/faker";
import { User } from "~/models/user";

const password = await Bun.password.hash("12345678");

export function createRandomUser(): User {
  return new User({
    username: faker.internet.userName(),
    avatarUrl: faker.image.avatar(),
    password,
  });
}

export async function seedUsers(count: number) {
  console.log(`Seeding users...`);
  const users = faker.helpers.multiple(createRandomUser, { count });
  await User.insertMany(users);
  console.log(`Seeding ${count} users completed successfully`);
}
