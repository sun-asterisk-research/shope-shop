import { component$, useContext } from "@builder.io/qwik";
import { Link, server$, useLocation } from "@builder.io/qwik-city";
import { AuthContext } from "~/contexts/auth";

const signOut = server$(function () {
  this.cookie.delete("shope_auth", {
    path: "/",
  });
});

const GuestMenu = () => (
  <>
    <Link
      href="/login"
      class="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 lg:px-5 lg:py-2.5"
    >
      Log in
    </Link>
    <Link
      href="/register"
      class="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:px-5 lg:py-2.5"
    >
      Get started
    </Link>
  </>
);

export default component$(() => {
  const location = useLocation();
  const auth = useContext(AuthContext);
  const defaultAvatarUrl = "/images/default-avatar.png";

  return (
    <header
      class={{
        hidden: ["/login/", "/register/", "/sign-out/"].includes(
          location.url.pathname,
        ),
        "fixed left-0 top-0 w-full shadow-md": true,
      }}
    >
      <nav class="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
          <Link href="/" class="flex items-center">
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Shope
            </span>
          </Link>
          <div class="flex items-center lg:order-2">
            {!auth.value.user && <GuestMenu />}

            {auth.value.user && (
              <div class="flex items-center space-x-3 rtl:space-x-reverse md:space-x-0">
                <Link href="/cart">
                  <button
                    type="button"
                    title="Cart"
                    class="relative top-1 mx-4"
                  >
                    <svg
                      class="h-6 w-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"
                      />
                    </svg>
                    {auth.value.cart > 0 && (
                      <div class="absolute -end-3 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
                        {auth.value.cart}
                      </div>
                    )}
                  </button>
                </Link>
                <button
                  type="button"
                  class="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:me-0"
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    src={auth.value.user.avatarUrl || defaultAvatarUrl}
                    alt="user photo"
                    width={80}
                    height={80}
                  />
                </button>
                <div
                  class="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
                  id="user-dropdown"
                >
                  <div class="px-4 py-3">
                    <span class="block text-sm text-gray-900 dark:text-white">
                      @{auth.value.user.username}
                    </span>
                    <span class="block truncate  text-sm text-gray-500 dark:text-gray-400">
                      {auth.value.user.id}
                    </span>
                  </div>
                  <ul class="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link
                        href="/cart"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        My cart
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/orders"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Order history
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick$={async () => {
                          await signOut();
                          window.location.href = "/";
                        }}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              class="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                class="hidden h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div
            class="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
            id="mobile-menu-2"
          >
            <ul class="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
              <li>
                <Link
                  href="/"
                  class={[
                    "block rounded py-2 pl-3 pr-4 capitalize text-gray-700 dark:text-white lg:bg-transparent lg:p-0 lg:hover:text-primary-700",
                    { "text-primary-700": location.url.pathname === "/" },
                  ]}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/men-clothes"
                  class={[
                    "block rounded py-2 pl-3 pr-4 capitalize text-gray-700 dark:text-white lg:bg-transparent lg:p-0 lg:hover:text-primary-700",
                    {
                      "text-primary-700":
                        location.url.pathname === "/men-clothes/",
                    },
                  ]}
                >
                  Men clothes
                </Link>
              </li>
              <li>
                <Link
                  href="/women-clothes"
                  class={[
                    "block rounded py-2 pl-3 pr-4 capitalize text-gray-700 dark:text-white lg:bg-transparent lg:p-0 lg:hover:text-primary-700",
                    {
                      "text-primary-700":
                        location.url.pathname === "/women-clothes/",
                    },
                  ]}
                >
                  Women clothes
                </Link>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://atlas.sun-asterisk.vn"
                  class="block border-b border-gray-100 py-2 pl-3 pr-4 capitalize text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-primary-700 lg:dark:hover:bg-transparent lg:dark:hover:text-white"
                >
                  Sun* Atlas
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
});
