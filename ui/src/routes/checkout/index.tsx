import { component$, useContext, useSignal } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  server$,
  Link,
} from "@builder.io/qwik-city";
import { AuthContext } from "~/contexts/auth";

export const useCheckoutData = routeLoader$<CheckoutData>(async (e) => {
  const res = await fetch(`${e.env.get("API_URL")}/cart/checkout`, {
    headers: {
      Authorization: `Bearer ${e.cookie.get("shope_auth")?.value}`,
    },
  });

  return res.json();
});

export const postCheckout = server$(async function (address: string) {
  const res = await fetch(`${this.env.get("API_URL")}/cart/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${this.cookie.get("shope_auth")?.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
    }),
  });

  return res.json();
});

export default component$(() => {
  const cart = useCheckoutData();
  const address = useSignal<string>("Hanoi, Vietnam");
  const auth = useContext(AuthContext);

  return (
    <div class="mx-auto max-w-lg p-8">
      <Link
        href="/cart"
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
        Back to cart
      </Link>

      <ol class="mx-auto max-w-lg divide-y divide-gray-200 dark:divide-gray-700">
        {cart.value.items.map(({ product, quantity, amount }, index) => (
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
                <div class="mt-1">
                  <span id={`quantity-${product._id}`} class="text-sm">
                    Q: {quantity}
                  </span>
                </div>
              </div>
              <div class="inline-flex items-center self-end text-sm font-bold text-orange-700 dark:text-white">
                ${amount}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div class="mx-auto mt-2 flex max-w-lg justify-end border-t border-gray-200 py-4">
        <span class="mr-4 font-bold text-gray-900">Total:</span>
        <span class="font-bold text-orange-600">${cart.value.total}</span>
      </div>

      <div class="mx-auto mt-2 max-w-lg border-t border-gray-200 py-4">
        <label for="address">Shipping address:</label>
        <input
          type="text"
          id="address"
          name="address"
          class="sm:text-md mt-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={address.value}
          onInput$={(e) =>
            (address.value = (e.target as HTMLInputElement).value)
          }
        />
      </div>

      <div class="mt-4 flex items-center justify-center">
        <button
          type="button"
          title="Send order"
          class="inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          onClick$={() => {
            postCheckout(address.value).then(() => {
              auth.value = { ...auth.value, cart: 0 };
              alert("Order sent successfully");
              window.location.href = "/orders";
            });
          }}
        >
          Submit order
        </button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Shope: Checkout",
  meta: [
    {
      name: "description",
      content: "simple-shop: fastity + qwik + tailwind",
    },
  ],
};
