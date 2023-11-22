import { faker } from "@faker-js/faker";
import { Product } from "~/models/product";

export function createRandomProduct(): Product {
  return new Product({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    imageUrl: faker.image.url({ width: 170, height: 170 }),
    discount: faker.number.int({ min: 0, max: 30 }),
  });
}

export async function seedProducts(count: number) {
  console.log(`Seeding products...`);
  const products = faker.helpers.multiple(createRandomProduct, { count });
  await Product.insertMany(products);
  console.log(`Seeding ${count} products completed successfully`);
}
