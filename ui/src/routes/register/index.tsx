import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link, routeLoader$ } from "@builder.io/qwik-city";
import {
  type InitialValues,
  useForm,
  formAction$,
  valiForm$,
} from "@modular-forms/qwik";
import { type Input, minLength, object, string, maxLength } from "valibot";

const RegisterSchema = object({
  username: string([
    minLength(1, "Please enter your username."),
    minLength(8, "Username must be at least 8 characters long."),
    maxLength(30, "Username cannot exceed 30 characters."),
  ]),
  password: string([
    minLength(1, "Please enter your password."),
    minLength(8, "Password must be at least 8 characters long."),
    maxLength(30, "Password cannot exceed 30 characters."),
  ]),
  confirmPassword: string([
    minLength(1, "Please enter your password confirmation."),
    minLength(8, "Password confirmation must be at least 8 characters long."),
    maxLength(30, "Password confirmation cannot exceed 30 characters."),
  ]),
});

type RegisterForm = Input<typeof RegisterSchema>;

export const useFormLoader = routeLoader$<InitialValues<RegisterForm>>(() => ({
  username: "devsuccess101",
  password: "12345678",
  confirmPassword: "12345678",
}));

export const useFormAction = formAction$<RegisterForm>(
  async (values, requestEvent) => {
    const baseUrl =
      requestEvent.env.get("API_URL") || import.meta.env.PUBLIC_API_URL;

    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (res.ok) {
      return {
        status: "success",
        message: "Login successful",
        data: data.username,
      };
    }

    return {
      status: "error",
      message: data.message,
    };
  },
  valiForm$(RegisterSchema),
);

export default component$(() => {
  const [registerForm, { Form, Field }] = useForm<RegisterForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(RegisterSchema),
  });

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
              Create your account
            </h1>

            {registerForm.response.status === "success" ? (
              <p class="rounded-lg bg-green-50 p-4 text-green-600">
                Your account <strong>{registerForm.response.data}</strong> is
                created successfully.{" "}
                <Link class="text-primary-600 hover:underline" href="/login">
                  <svg
                    class="mr-2 h-4 w-4 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 15"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"
                    />
                  </svg>{" "}
                  Login
                </Link>
              </p>
            ) : (
              <Form class="space-y-4 md:space-y-6">
                {registerForm.response.status === "error" && (
                  <p class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    Error: {registerForm.response.message}.
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
                        <p class="mt-2 text-sm text-red-600">{field.error}</p>
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
                        <p class="mt-2 text-sm text-red-600">{field.error}</p>
                      )}
                    </div>
                  )}
                </Field>
                <Field name="confirmPassword">
                  {(field, props) => (
                    <div>
                      <label
                        for={field.name}
                        class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Confirm password
                      </label>
                      <input
                        {...props}
                        type="password"
                        id={field.name}
                        value={field.value}
                        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                      />
                      {field.error && (
                        <p class="mt-2 text-sm text-red-600">{field.error}</p>
                      )}
                    </div>
                  )}
                </Field>
                <button
                  type="submit"
                  class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign up
                </button>
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/register"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </Link>
                </p>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Shope: Register",
  meta: [
    {
      name: "description",
      content: "simple-shop: fastity + qwik + tailwind",
    },
  ],
};
