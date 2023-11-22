import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import HeroSection from "~/components/hero-section/hero-section";

export default component$(() => {
  return (
    <>
      <HeroSection />
    </>
  );
});

export const head: DocumentHead = {
  title: "Shope: Atlas Demo",
  meta: [
    {
      name: "description",
      content: "simple-shop: fastity + qwik + tailwind",
    },
  ],
};
