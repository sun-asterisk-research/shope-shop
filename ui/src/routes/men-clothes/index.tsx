import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import ProductCard from "~/components/product-card/product-card";

export const useProductsData = routeLoader$<List<Product>>(async (e) => {
  const res = await fetch(`${e.env.get("API_URL")}/products/latest?limit=24`);
  if (!res.ok) {
    return { data: [] };
  }

  return res.json();
});

export default component$(() => {
  const data = useProductsData();

  return (
    <div class="mx-auto grid max-w-4xl grid-cols-2 gap-4 p-8 sm:grid-cols-3 md:grid-cols-4 xl:max-w-7xl xl:grid-cols-6">
      {data.value.data.map((product, index) => (
        <ProductCard product={product} key={index} />
      ))}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Shope: Men Clothes",
  meta: [
    {
      name: "description",
      content: "simple-shop: fastity + qwik + tailwind",
    },
  ],
};
