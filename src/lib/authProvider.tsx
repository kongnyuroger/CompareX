"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextProviderprop = {
  token: string | null;
  login: (token: string | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextProviderprop>({
  token: null,
  login: () => {},
  logout: () => {},
});

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  const login = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      router.push("/");
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  return (
    <UserContext.Provider value={{ token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
