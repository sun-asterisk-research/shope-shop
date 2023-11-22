import { component$, useContext } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { addToCart as addToCart } from "~/components/product-card/product-card";
import { AuthContext } from "~/contexts/auth";

export const useProductData = routeLoader$<Product | undefined>(async (e) => {
  const res = await fetch(
    `${e.env.get("API_URL")}/products/${e.params.product}`,
  );
  if (!res.ok) {
    return null;
  }

  return res.json();
});

export default component$(() => {
  const product = useProductData();
  const auth = useContext(AuthContext);

  if (!product.value) {
    return <>Loading...</>;
  }

  return (
    <section class="p-8">
      <div class="bg-white dark:bg-gray-900">
        <div class="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
          <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              {product.value.title}
            </h1>
            <p class="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              {product.value.description}
            </p>
            <p class="mb-6 max-w-2xl font-bold text-gray-800 dark:text-gray-400 md:text-2xl">
              <strong class="mr-8">Price:</strong>
              <span class="mr-4 text-2xl text-orange-600">
                ${product.value.price.toFixed(2)}
              </span>
              <del class="text-base text-gray-500 dark:text-gray-600">
                $
                {(
                  product.value.price +
                  (product.value.price * product.value.discount) / 100
                ).toFixed(2)}
              </del>
            </p>
            <button
              type="button"
              class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 mr-3 inline-flex items-center justify-center rounded-lg px-5 py-3 text-center text-base font-medium text-white focus:ring-4"
              onClick$={() => {
                addToCart(product.value._id).then((res) => {
                  auth.value = { ...auth.value, cart: res.count };
                  alert("Added to cart");
                });
              }}
            >
              <svg
                class="mr-2 h-4 w-4 text-white"
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
                  d="M8 5h4m-2 2V3M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.938-11H17l-2 7H5m0 0L3 4m0 0h2M3 4l-.792-3H1"
                />
              </svg>
              Add to cart
            </button>
          </div>
          <div class="hidden lg:col-span-5 lg:mt-0 lg:flex">
            <img
              class="rounded-lg shadow-lg"
              src={product.value.imageUrl}
              alt="product image"
              width={468}
              height={350}
            />
          </div>
        </div>
      </div>
    </section>
  );
});
