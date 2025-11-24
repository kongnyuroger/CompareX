"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useRouter();
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);
  console.log(token);
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate.push("/login");
  };
  return (
    <nav className="flex items-center justify-between mb-6">
      <div>
        {" "}
        <Link className="text-2xl font-semibold text-primary-900" href="/">
          <span className="text-4xl text-primary">C</span>ompareX
        </Link>{" "}
      </div>

      <div className="navbar-actions flex items-center gap-4">
        {(!token && (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Log in
            </Link>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate.push("/register")}
            >
              Sign up
            </button>
          </>
        )) ||
          (token && (
            <button type="button" className="btn-primary" onClick={logout}>
              Logout
            </button>
          ))}
      </div>
    </nav>
  );
}
