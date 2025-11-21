"use client";

import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between mb-6">
      <div>
        {" "}
        <Link className="text-2xl font-semibold text-primary-900" href="/">
          <span className="text-4xl text-primary">C</span>ompareX
        </Link>{" "}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <Link href="login"> Log in </Link>
        </button>
        <button type="button" className="btn-primary ">
          <Link href="/register">Sign up</Link>
        </button>
      </div>
    </nav>
  );
}
