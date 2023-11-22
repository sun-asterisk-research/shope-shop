import { cleanEnv, host, port, str } from "envalid";

export const config = cleanEnv(process.env, {
  HOST: host({
    default: "0.0.0.0",
  }),
  PORT: port({
    default: 3000,
  }),
  DATABASE_URL: str({
    devDefault: "mongodb://username:password@mongodb:27017/database",
  }),
  JWT_SECRET: str({
    devDefault: "secret",
  }),
});
