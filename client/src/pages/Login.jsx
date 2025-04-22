import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogin } from "../redux/state";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL; // Use import.meta.env for Vite

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Get data after fetching
      const loggedIn = await response.json();

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/");
      }
    } catch (err) {
      console.log("Login failed", err.message);
    }
  };

  return (
    <div className="absolute h-full w-full bg-primary/40 z-50 flexCenter">
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-2 bg-white w-[366px] p-7 rounded-xl shadow-md text-[14px]"
        >
          <div className="flex justify-between items-baseline my-4">
            <h4 className="bold-28">{"Login"}</h4>
          </div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            value={email}
            placeholder="Email Address"
            required
            className="bg-primary text-secondary border p-2 pl-4 rounded-md outline-none"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            required
            className="bg-primary text-secondary border p-2 pl-4 rounded-md outline-none"
          />
          <button type="submit" className="btn-secondary rounded">
            Login
          </button>
          <div className="text-gray-30">
            Don't have an account?
            <Link
              to={"/register"}
              className="text-white bg-primary/40 rounded-md p-1 cursor-pointer"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
