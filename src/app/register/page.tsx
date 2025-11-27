"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { register } from ".././services/api";

const RegisterPage = () => {
  const passwordId = useId();
  const usernameId = useId();
  const emailId = useId();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);
      const res = await register(username, email, password);

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("userName", res.data.user.username);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(message);
    } finally {
      setLoading(false);
    }
    setEmail("");
    setPassword("");
    setUserName("");
    window.location.reload();
  };

  return (
    <div className="text-center justify-center px-6">
      <h1 className="text-6xl font-bold text-[#1F2937] mb-12">Sign up</h1>

      <form onSubmit={handleSubmit} className="flex justify-center">
        <div className="w-full max-w-[600px] flex flex-col gap-6">
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded-md">{error}</p>
          )}

          <div>
            <label htmlFor={usernameId} className="sr-only">
              User name
            </label>
            <input
              id={usernameId}
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="User Name*"
              required
            />
          </div>

          <div>
            <label htmlFor={emailId} className="sr-only">
              Email
            </label>
            <input
              className="form-input"
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email*"
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
              {(loading && <h1>Loading...</h1>) || <h1>Sign up</h1>}
            </button>
          </div>

          <p>
            Already have an account?{" "}
            <Link className="text-primary text-2xl" href="/login">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
