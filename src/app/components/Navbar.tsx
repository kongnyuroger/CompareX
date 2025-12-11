"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUserContext } from "@/lib/authProvider";

export default function Navbar() {
  const { token, loading } = useUserContext();
  const navigate = useRouter();

  return (
    <nav className="sticky top-0 py-3 z-50 w-full flex items-center bg-background justify-between mb-5">
      <SidebarTrigger className="md:hidden">
        <Menu />
      </SidebarTrigger>
      {/* Updated container for centering logo on mobile */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <Link className="text-xl font-semibold text-primary-900" href="/">
          <span className="text-2xl text-primary">C</span>ompareX
        </Link>
      </div>

      <div className="navbar-actions flex items-center gap-4">
        {loading ? null : token ? null : (
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
