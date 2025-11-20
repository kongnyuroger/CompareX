"use client";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6">
      <div className="text-2xl font-semibold text-primary-900">CompareX</div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-sm text-gray-600 hover:text-gray-900 "
        >
          Log in
        </button>
        <button type="button" className="btn-primary">
          Sign up
        </button>
      </div>
    </nav>
  );
}
