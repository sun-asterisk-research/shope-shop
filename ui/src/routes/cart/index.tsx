import { component$, useContext } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  server$,
  Link,
} from "@builder.io/qwik-city";
import { AuthContext } from "~/contexts/auth";

export const useCartData = routeLoader$<{ items: CartItem[] }>(async (e) => {
  const res = await fetch(`${e.env.get("API_URL")}/cart`, {
    headers: {
      Authorization: `Bearer ${e.cookie.get("shope_auth")?.value}`,
    },
  });

  return res.json();
});

export const updateItem = server$(async function (
  productId: string,
  method: "DELETE" | "POST",
) {
  const res = await fetch(`${this.env.get("API_URL")}/cart/item`, {
    method,
    headers: {
      Authorization: `Bearer ${this.cookie.get("shope_auth")?.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  return res.json();
});

export default component$(() => {
  const cart = useCartData();
  const auth = useContext(AuthContext);

  return (
    <div class="mx-auto max-w-lg p-8">
      <Link
        href="/"
        class="mb-8 inline-flex items-center text-base font-bold text-gray-900"
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
        Back to home
      </Link>

      {cart.value.items.length <= 0 && (
        <>
          <div class="rounded-lg bg-gray-200 px-8 py-4">Your cart is empty</div>

          <div class="mt-8 flex items-center justify-center">
            <Link
              href="/"
              class="inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Back to home
            </Link>
          </div>
        </>
      )}

      {cart.value.items.length > 0 && (
        <>
          <ul class="mx-auto max-w-lg divide-y divide-gray-200 dark:divide-gray-700">
            {cart.value.items.map(({ product, quantity }, index) => (
              <li key={index} class="pb-3 sm:pb-4" id={`item-${product._id}`}>
                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                  <div class="flex-shrink-0">
                    <img
                      class="h-20 w-20"
                      src={product.imageUrl}
                      alt="Neil image"
                      width={170}
                      height={170}
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {product.title}
                    </p>
                    <p class="mt-1 truncate text-sm text-gray-400">
                      <del>
                        $
                        {(
                          product.price +
                          (product.price * product.discount) / 100
                        ).toFixed(2)}
                      </del>
                      <span class="mx-2 inline-flex items-center text-sm text-orange-600">
                        ${product.price}
                      </span>
                    </p>
                    <div class="mt-1 flex flex-row items-center">
                      <button
                        type="button"
                        class="px-4 text-base"
                        onClick$={() => {
                          updateItem(product._id, "DELETE").then((res) => {
                            auth.value = { ...auth.value, cart: res.count };
                          });
                          const el = document.getElementById(
                            `quantity-${product._id}`,
                          ) as HTMLInputElement | null;
                          if (el) {
                            const nextVal = Number(el.value) - 1;
                            if (nextVal <= 0) {
                              document
                                .getElementById(`item-${product._id}`)
                                ?.remove();
                            } else {
                              el.value = String(nextVal);
                            }
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        readOnly
                        id={`quantity-${product._id}`}
                        title="Quantity"
                        class="w-14 border border-gray-400 px-2 text-center text-sm"
                        value={quantity}
                      />
                      <button
                        type="button"
                        class="px-4 text-base"
                        onClick$={() => {
                          updateItem(product._id, "POST").then((res) => {
                            auth.value = { ...auth.value, cart: res.count };
                          });
                          const el = document.getElementById(
                            `quantity-${product._id}`,
                          ) as HTMLInputElement | null;
                          if (el) {
                            const nextVal = Number(el.value) + 1;
                            el.value = String(nextVal);
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div class="mt-4 flex items-center justify-center">
            <Link
              href="/checkout"
              class="inline-flex items-center justify-center rounded-lg bg-orange-700 px-5 py-2 text-center text-base font-medium text-white hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 dark:focus:ring-primary-900"
            >
              Checkout
              <svg
                class="-mr-1 ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
        </>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Shope: My Cart",
  meta: [
    {
      name: "description",
      content: "simple-shop: fastity + qwik + tailwind",
    },
  ],
};
