"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useUserContext } from "@/lib/authProvider";
import { loginUser } from ".././services/api";

const LoginPage = () => {
  const router = useRouter();
  const passwordId = useId();
  const userUniqueId = useId();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUserContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(emailOrUsername, password);
      const token = res.data.token;
      login(token);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="text-center justify-center px-6">
      <h1 className="text-6xl font-bold text-[#1F2937] mb-12">Log in</h1>

      <form action="" onSubmit={handleSubmit} className="flex justify-center">
        <div className="w-full max-w-[600px] flex flex-col gap-6">
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded-md">{error}</p>
          )}
          <div>
            <label htmlFor={userUniqueId} className="sr-only">
              email
            </label>
            <input
              id={userUniqueId}
              className="form-input"
              value={emailOrUsername}
              type="text"
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="User Name* or Email*"
              required
            />
          </div>

          <div>
            <label htmlFor={passwordId} className="sr-only">
              Password
            </label>
            <input
              id={passwordId}
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password*"
              required
            />
          </div>
          <div>
            <button className="btn-form" type="submit">
              {loading ? "Loading...." : "Log in"}
            </button>
          </div>
          <p>
            Don't have and acount{" "}
            <Link className="text-primary text-2xl" href="/register">
              {" "}
              Sign up
            </Link>{" "}
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
