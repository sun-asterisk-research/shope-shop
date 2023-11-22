import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  server$,
  Link,
} from "@builder.io/qwik-city";

export const useOrdersData = routeLoader$<List<Order>>(async (e) => {
  const res = await fetch(`${e.env.get("API_URL")}/orders`, {
    headers: {
      Authorization: `Bearer ${e.cookie.get("shope_auth")?.value}`,
    },
  });

  return res.json();
});

export const loadMore = server$(async function (nextCursor: string) {
  const res = await fetch(
    `${this.env.get("API_URL")}/orders?cursor=${nextCursor}`,
    {
      headers: {
        Authorization: `Bearer ${this.cookie.get("shope_auth")?.value}`,
      },
    },
  );

  return res.json();
});

export default component$(() => {
  const orders = useOrdersData();

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

      <ol class="divide-y divide-gray-200 dark:divide-gray-700">
        {orders.value.data.map(
          ({ items, total, address, createdAt }, index) => (
            <li key={index} class="py-3">
              <div class="flex items-center space-x-4 rtl:space-x-reverse">
                <div class="flex-shrink-0">
                  <img
                    class="h-20 w-20"
                    src={items[0].product.imageUrl}
                    alt="First product image"
                    width={170}
                    height={170}
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {items[0].product.title}
                  </p>
                  <p class="mt-1 truncate text-sm text-gray-500">
                    Total items: {items.length}
                  </p>
                  <p class="mt-1 truncate text-sm text-gray-500">
                    Address: {address}
                  </p>
                  <p class="mt-1 truncate text-sm text-gray-500">{createdAt}</p>
                </div>
                <div class="inline-flex items-center text-sm font-bold text-orange-700 dark:text-white">
                  ${total.toFixed(2)}
                </div>
              </div>
            </li>
          ),
        )}
      </ol>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Shope: Order History",
  meta: [
    {
      name: "description",
      content: "simple-shop: fastity + qwik + tailwind",
    },
  ],
};
