"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextProviderprop = {
  token: string | null;
  login: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextProviderprop>({
  token: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    setLoading(false);
  }, []);

  const login = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      router.push("/");
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  return (
    <UserContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
