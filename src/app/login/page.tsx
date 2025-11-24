"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { loginUser } from ".././services/api";

const LoginPage = () => {
  const router = useRouter();
  const passwordId = useId();
  const userUniqueId = useId();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);
      const res = await loginUser(emailOrUsername, password);

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("userName", res.data.user.username);

      router.push("/");
    } catch (err: any) {
      const message = err.response?.data?.message;

      setError(message);
    }

    setLoading(false);
    setEmailOrUsername("");
    setPassword("");
    window.location.reload();
  };

  return (
    <div className="text-center justify-center">
      <h1 className="text-8xl  font-semibold text-[#1F2937] mb-[50px]">
        Log in
      </h1>

      <form action="" onSubmit={handleSubmit} className="flex justify-center">
        <div className="w-full flex flex-col gap-4 ">
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
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password*"
              required
            />
          </div>
          <div>
            <button
              className=" bg-primary text-2xl p-4 w-full  sm:w-1/2 text-white cursor-pointer
                rounded-xl hover:bg-primary-dark"
              type="submit"
            >
              {(loading && <h1>Loading...</h1>) || <h1>Log in</h1>}
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
