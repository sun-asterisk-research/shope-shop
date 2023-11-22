import { component$, Slot, useContextProvider } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import HeaderSection from "~/components/header-section/header-section";
import type { AuthData } from "~/contexts/auth";
import { AuthContext } from "~/contexts/auth";

export const onGet: RequestHandler = async ({ cacheControl, url }) => {
  if (url.pathname === "/men-clothes/" || url.pathname === "/women-clothes/") {
    // Control caching for this request for best performance and to reduce hosting costs:
    // https://qwik.builder.io/docs/caching/
    cacheControl({
      // Always serve a cached response by default, up to a week stale
      staleWhileRevalidate: 60 * 60 * 24 * 7,
      // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
      maxAge: 5,
    });
  }
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useAuthData = routeLoader$<AuthData>(async (e) => {
  const baseUrl = e.env.get("API_URL");
  const res = await fetch(`${baseUrl}/auth/user`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${e.cookie.get("shope_auth")?.value}`,
    },
  });

  if (!res.ok) {
    return {
      user: null,
      cart: 0,
    };
  }

  const { authUser, cartItems } = await res.json();

  return { user: authUser, cart: cartItems.count };
});

export default component$(() => {
  const auth = useAuthData();
  useContextProvider(AuthContext, auth);

  return (
    <>
      <HeaderSection />

      <main class="pt-[52px]">
        <Slot />
      </main>
    </>
  );
});
