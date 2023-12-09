import Fastify from "fastify";
import cors from "@fastify/cors";
import * as mongoose from "mongoose";
import { config } from "./config";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import cartRoutes from "./routes/cart";
import healthcheck from "./routes/healthcheck";
import checkoutRoutes from "./routes/checkout";

await mongoose.connect(config.DATABASE_URL);

const fastify = Fastify({
  logger: {
    level: config.isDev ? "debug" : "info",
  },
});

fastify.register(cors, {
  origin: config.isDev || [
    "https://sun-asterisk-research.github.io",
    "https://shope1.sun-asterisk.vn",
    "https://shope2.sun-asterisk.vn",
    "https://shope3.sun-asterisk.vn",
    "https://shope4.sun-asterisk.vn",
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
});

fastify.register(jwtPlugin);
fastify.register(healthcheck);
fastify.register(authRoutes);
fastify.register(productRoutes);
fastify.register(cartRoutes);
fastify.register(checkoutRoutes);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    try {
      fastify.log.info(`Close application on ${signal}`);
      await fastify.close();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}

process.on("unhandledRejection", (err) => {
  fastify.log.error(err);
  process.exit(1);
});

try {
  await fastify.listen({ port: config.PORT, host: config.HOST });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
