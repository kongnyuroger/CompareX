"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/lib/authProvider";
export default function Navbar() {
  const { token, logout, loading } = useUserContext();
  const navigate = useRouter();

  return (
    <nav className="flex items-center justify-between mb-30">
      <div>
        {" "}
        <Link className="text-2xl font-semibold text-primary-900" href="/">
          <span className="text-4xl text-primary">C</span>ompareX
        </Link>{" "}
      </div>

      <div className="navbar-actions flex items-center gap-4">
        {loading ? null : token ? (
          <button type="button" className="btn-primary" onClick={logout}>
            {" "}
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <button
              type="button"
              className="btn-primary tea"
              onClick={() => navigate.push("/register")}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
