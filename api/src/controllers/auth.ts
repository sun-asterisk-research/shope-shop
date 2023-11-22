import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "~/models/user";
import { JwtPayload } from "~/plugins/jwt";

type RegisterRequest = FastifyRequest<{
  Body: {
    username: string;
    password: string;
    confirmPassword: string;
  };
}>;

type LoginRequest = FastifyRequest<{
  Body: {
    username: string;
    password: string;
  };
}>;

/**
 * Handle register a new account
 *
 * @param req RegisterRequest
 * @param reply FastifyReply
 * @returns
 */
export const register = async (req: RegisterRequest, reply: FastifyReply) => {
  if (req.body.password !== req.body.confirmPassword) {
    reply
      .code(400)
      .send({ error: "Bad Request", message: "Passwords do not match" });
    return;
  }

  const user = await User.findOne({ username: req.body.username });
  if (user) {
    reply.code(400).send({
      error: "Bad Request",
      message: "The username is already in use by another user",
    });
    return;
  }

  const newUser = new User({
    username: req.body.username,
    password: await Bun.password.hash(req.body.password),
  });

  await newUser.save();

  reply
    .code(200)
    .send({ message: "Registration successful", username: req.body.username });
};

/**
 * Return access token for the login request
 *
 * @param req LoginRequest
 * @param res FastifyReply
 * @returns
 */
export const login = async (req: LoginRequest, res: FastifyReply) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.code(400).send({
      error: "Bad Request",
      message: "Invalid username or password",
    });
    return;
  }

  const validPassword = await Bun.password.verify(
    req.body.password,
    user.password
  );
  if (!validPassword) {
    res.code(400).send({
      error: "Bad Request",
      message: "Invalid username or password",
    });
  }

  const expiredAt = new Date().getTime() + 2 * 60 * 60 * 1000;
  const accessToken = req.jwt.sign({
    sub: user.id,
    prefered_username: user.username,
    picture: user.avatarUrl,
    aud: "shope",
    exp: expiredAt,
    iat: new Date().getTime(),
  });

  return {
    accessToken,
    expiredAt: new Date().getTime() + 2 * 60 * 60 * 1000, // 2 hours
  };
};

/**
 * Get profile of auth user
 *
 * @param req FastifyRequest
 * @param res FastifyReply
 */
export const authUser = async (req: FastifyRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub);

  res.code(200).send({
    authUser: {
      id: req.user.sub,
      username: authUser?.username,
      avatarUrl: authUser?.avatarUrl || null,
    },
    cartItems: {
      count: authUser?.cart?.items.length,
    },
  });
};
