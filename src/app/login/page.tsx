import Link from "next/link";
import { useId } from "react";

const LoginPage = () => {
  const passwordId = useId();
  const userUniqueId = useId();
  return (
    <div className="text-center justify-center">
      <h1 className="text-8xl  font-semibold text-[#1F2937] mb-[50px]">
        Log in
      </h1>

      <form action="" className="flex justify-center">
        <div className="w-full flex flex-col gap-4 ">
          <div>
            <label htmlFor={userUniqueId} className="sr-only">
              email
            </label>
            <input
              id={userUniqueId}
              className="form-input"
              type="text"
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
              Log in
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
