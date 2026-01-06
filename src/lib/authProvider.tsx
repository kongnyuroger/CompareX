"use client";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  badge: string;
  badgeColor: string;
  imageUrl: string;
  source: string;
  productUrl: string;
};

type UserContextProviderprop = {
  token: string | null;
  login: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
  products: Product[];
  setProducts: (products: Product[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const UserContext = createContext<UserContextProviderprop>({
  token: null,
  login: () => {},
  logout: () => {},
  loading: false,
  products: [],
  setProducts: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
});

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    setLoading(false);
  }, []);

  const login = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      const decodedPayload = jwtDecode<{ username: string }>(newToken);
      console.log("here is the decoded token:", decodedPayload);

      localStorage.setItem("username", decodedPayload.username);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    localStorage.removeItem("username");
    router.push("/");
  };

  return (
    <UserContext.Provider
      value={{
        token,
        login,
        logout,
        loading,
        products,
        setProducts,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
