import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link, routeLoader$ } from "@builder.io/qwik-city";
import {
  type InitialValues,
  useForm,
  formAction$,
  valiForm$,
} from "@modular-forms/qwik";
import { type Input, minLength, object, string } from "valibot";

const LoginSchema = object({
  username: string([minLength(1, "Please enter your username.")]),
  password: string([minLength(1, "Please enter your password.")]),
});

type LoginForm = Input<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  username: import.meta.env.PUBLIC_USERNAME_DEFAULT,
  password: "12345678",
}));

export const useFormAction = formAction$<LoginForm>(
  async (values, requestEvent) => {
    const publicUrl = requestEvent.url.origin.replace(
      /^(http[s]?:\/\/[a-z]+)/,
      "$1api",
    );
    const baseUrl =
      requestEvent.env.get("API_URL") ||
      import.meta.env.PUBLIC_API_URL ||
      publicUrl;

    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      return {
        status: "error",
        message: data.message,
      };
    }

    requestEvent.cookie.set("shope_auth", data.accessToken, {
      path: "/",
      httpOnly: true,
    });

    return {
      status: "success",
      message: "Login successful",
      data: data,
    };
  },
  valiForm$(LoginSchema),
);

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(LoginSchema),
  });

  if (loginForm.response.status === "success") {
    window.location.href = "/";
    return <>Redirecting...</>;
  }

  return (
    <section class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <Link
          href="/"
          class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <svg
            class="mr-2 h-4 w-4 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          Shope
        </Link>

        <div class="w-full max-w-sm rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 md:mt-0">
          <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Sign in to your account
            </h1>
            <Form class="space-y-4 md:space-y-6">
              {loginForm.response.status === "error" && (
                <p class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  Error: {loginForm.response.message}.
                </p>
              )}

              <Field name="username">
                {(field, props) => (
                  <div>
                    <label
                      for={field.name}
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      {...props}
                      type="text"
                      id={field.name}
                      value={field.value}
                      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    />
                    {field.error && (
                      <p class="mt-2 text-red-600">{field.error}</p>
                    )}
                  </div>
                )}
              </Field>
              <Field name="password">
                {(field, props) => (
                  <div>
                    <label
                      for={field.name}
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      {...props}
                      type="password"
                      id={field.name}
                      value={field.value}
                      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    />
                    {field.error && (
                      <p class="mt-2 text-red-600">{field.error}</p>
                    )}
                  </div>
                )}
              </Field>
              <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      class="focus:ring-3 mr-2 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      for="remember"
                      class="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <Link
                  href="/forgot-password"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/register"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Shope: Login",
  meta: [
    {
      name: "description",
      content: "simple-shop: fastity + qwik + tailwind",
    },
  ],
};
