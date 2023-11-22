import { type Signal, createContextId } from "@builder.io/qwik";

export interface AuthData {
  user: User | null;
  cart: number;
}

export const AuthContext = createContextId<Signal<AuthData>>("auth-context");
