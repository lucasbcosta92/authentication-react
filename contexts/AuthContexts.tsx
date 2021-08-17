import { createContext, ReactNode, useState } from "react";
import { setCookie } from "nookies";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credential: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContexts = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias - tempo de expiração
        path: "/", // Caminhos que terão acesso ao cookie - Global
      });
      setCookie(undefined, "nextauth.refreshToken", refreshToken);

      setUser({
        email,
        permissions,
        roles,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContexts.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContexts.Provider>
  );
}
