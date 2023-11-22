import { component$, useContext } from "@builder.io/qwik";
import { Link, server$ } from "@builder.io/qwik-city";
import { AuthContext } from "~/contexts/auth";

interface ProductCardProps {
  product: Product;
  class?: string;
}

export const addToCart = server$(async function (productId: string) {
  const res = await fetch(`${this.env.get("API_URL")}/cart/item`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.cookie.get("shope_auth")?.value}`,
    },
    body: JSON.stringify({ productId }),
  }).then((res) => res.json());

  return res;
});

export default component$<ProductCardProps>(({ product, class: classes }) => {
  const auth = useContext(AuthContext);

  return (
    <div
      class={[
        "w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800",
        classes,
      ]}
    >
      <Link href={`/products/${product._id}`}>
        <img
          class="w-full rounded-t-lg"
          src={product.imageUrl}
          alt="product image"
          width={170}
          height={170}
        />
      </Link>
      <div class="flex flex-col justify-between p-2">
        <div class="block min-h-[40px]">
          <h5 class="line-clamp-2 max-h-10 text-sm tracking-tight text-gray-900 dark:text-white">
            {product.title}
          </h5>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <span class="align-middle text-base text-orange-600">
            ${product.price}
          </span>
          <svg
            class="hover:text-primary-500 h-5 w-5 cursor-pointer align-middle text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick$={() => {
              addToCart(product._id).then((res) => {
                auth.value = { ...auth.value, cart: res.count };
                alert("Added to cart");
              });
            }}
          >
            <path d="m17.855 11.273 2.105-7a.952.952 0 0 0-.173-.876 1.042 1.042 0 0 0-.37-.293 1.098 1.098 0 0 0-.47-.104H5.021L4.395.745a.998.998 0 0 0-.376-.537A1.089 1.089 0 0 0 3.377 0H1.053C.773 0 .506.105.308.293A.975.975 0 0 0 0 1c0 .265.11.52.308.707.198.187.465.293.745.293h1.513l.632 2.254v.02l2.105 6.999.785 2.985a3.13 3.13 0 0 0-1.296 1.008 2.87 2.87 0 0 0-.257 3.06c.251.484.636.895 1.112 1.19a3.295 3.295 0 0 0 3.228.12c.5-.258.918-.639 1.208-1.103.29-.465.444-.995.443-1.535a2.834 2.834 0 0 0-.194-1h2.493a2.84 2.84 0 0 0-.194 1c0 .593.186 1.173.533 1.666.347.494.84.878 1.417 1.105a3.314 3.314 0 0 0 1.824.17 3.213 3.213 0 0 0 1.617-.82 2.95 2.95 0 0 0 .864-1.536 2.86 2.86 0 0 0-.18-1.733 3.038 3.038 0 0 0-1.162-1.346 3.278 3.278 0 0 0-1.755-.506h-7.6l-.526-2h9.179c.229 0 .452-.07.634-.201a1 1 0 0 0 .379-.524Zm-2.066 4.725a1.1 1.1 0 0 1 .585.168c.173.11.308.267.388.45.08.182.1.383.06.577a.985.985 0 0 1-.288.512 1.07 1.07 0 0 1-.54.274 1.104 1.104 0 0 1-.608-.057 1.043 1.043 0 0 1-.472-.369.965.965 0 0 1-.177-.555c0-.265.11-.52.308-.707.197-.188.465-.293.744-.293Zm-7.368 1a.965.965 0 0 1-.177.555c-.116.165-.28.293-.473.369a1.104 1.104 0 0 1-.608.056 1.07 1.07 0 0 1-.539-.273.985.985 0 0 1-.288-.512.953.953 0 0 1 .06-.578c.08-.182.214-.339.388-.448a1.092 1.092 0 0 1 1.329.124.975.975 0 0 1 .308.707Zm5.263-8.999h-1.053v1c0 .265-.11.52-.308.707a1.081 1.081 0 0 1-.744.293c-.28 0-.547-.106-.745-.293a.975.975 0 0 1-.308-.707v-1H9.474a1.08 1.08 0 0 1-.745-.293A.975.975 0 0 1 8.421 7c0-.265.11-.52.308-.707.198-.187.465-.293.745-.293h1.052V5c0-.265.111-.52.309-.707.197-.187.465-.292.744-.292.279 0 .547.105.744.292a.975.975 0 0 1 .308.707v1h1.053c.28 0 .547.106.744.293a.975.975 0 0 1 .309.707c0 .265-.111.52-.309.707a1.081 1.081 0 0 1-.744.293Z" />
          </svg>
        </div>
      </div>
    </div>
  );
});
