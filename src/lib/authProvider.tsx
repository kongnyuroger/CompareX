"use client";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const UserContext = createContext<UserContextProviderprop>({
  token: null,
  login: () => {},
  logout: () => {},
  loading: false,
  products: [],
  setProducts: () => undefined,
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

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    localStorage.removeItem("username");
    router.push("/");
  }, [router]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      try {
        const decoded = jwtDecode<{ exp: number }>(t);
        if (decoded.exp * 1000 < Date.now()) {
          // Token already expired – clean up silently
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        } else {
          setToken(t);
          // Schedule logout for exactly when the token expires
          const msUntilExpiry = decoded.exp * 1000 - Date.now();
          const timerId = setTimeout(() => {
            logout();
          }, msUntilExpiry);
          setLoading(false);
          return () => clearTimeout(timerId);
        }
      } catch {
        // Malformed token – remove it
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
    }
    setLoading(false);
  }, [logout]);

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
