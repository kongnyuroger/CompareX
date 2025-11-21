import Link from "next/link";
import { useId } from "react";

const RegisterPage = () => {
  const passwordId = useId();
  const usernameId = useId();
  const emailId = useId();
  return (
    <div className="text-center justify-center">
      <h1 className="text-8xl  font-semibold text-[#1F2937] mb-[50px]">
        Sign up
      </h1>

      <form action="" className="flex justify-center">
        <div className="w-full flex flex-col gap-4 ">
          <div>
            <label htmlFor={usernameId} className="sr-only">
              User name
            </label>
            <input
              id={usernameId}
              className="form-input"
              type="text"
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
              placeholder="Password*"
              required
            />
          </div>
          <div>
            <button
              className=" bg-primary text-2xl p-4 w-full sm:w-1/2 text-white cursor-pointer
                rounded-xl  hover:bg-primary-dark"
              type="submit"
            >
              Sign up
            </button>
          </div>
          <p>
            Already have and acount{" "}
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
