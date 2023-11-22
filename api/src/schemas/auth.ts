import S from "fluent-json-schema";

export const registerSchema = {
  body: S.object()
    .prop(
      "username",
      S.string().required().minLength(8).maxLength(30).pattern("^[a-zA-Z0-9]+$")
    )
    .prop("password", S.string().required().minLength(8).maxLength(30))
    .prop("confirmPassword", S.string().required().minLength(8).maxLength(30)),
};

export const loginSchema = {
  body: S.object()
    .prop("username", S.string().required())
    .prop("password", S.string().required()),
};
