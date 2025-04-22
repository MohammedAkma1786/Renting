import React, { useEffect, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const API_URL = import.meta.env.VITE_API_URL; // Use import.meta.env for Vite

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const register_form = new FormData();

      for (const key in formData) {
        register_form.append(key, formData[key]);
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: register_form,
      });

      if (response.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration failed", err.message);
    }
  };

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword || formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  return (
    <div className="absolute h-full w-full bg-primary/40 z-50 flexCenter">
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-2 bg-white w-[366px] p-7 rounded-xl shadow-md text-[14px]"
        >
          <div className="flex justify-between items-baseline my-4">
            <h4 className="bold-28">{"Sign Up"}</h4>
          </div>
          <input
            onChange={handleChange}
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            className="bg-primary text-white border p-2 pl-4 rounded-md outline-none"
          />
          <input
            onChange={handleChange}
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            className="bg-primary text-white border p-2 pl-4 rounded-md outline-none"
          />
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="bg-primary text-white border p-2 pl-4 rounded-md outline-none"
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Password"
            required
            className="bg-primary text-white border p-2 pl-4 rounded-md outline-none"
          />
          <input
            onChange={handleChange}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="bg-primary text-white border p-2 pl-4 rounded-md outline-none"
          />

          {!passwordMatch && <p>Passwords do not match</p>}

          <input
            onChange={handleChange}
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            hidden
            required
          />
          <label htmlFor="image">
            <div className="flexCenter ring-1 ring-slate-900/10 p-1 h-16 w-16 rounded">
              {formData.profileImage ? (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Profile Preview"
                  className="p-1 h-16 object-contain aspect-square"
                />
              ) : (
                <UploadIcon className="text-tertiary" />
              )}
            </div>
          </label>
          <button type="submit" className="btn-secondary rounded">
            Register
          </button>
          <div className="text-gray-30">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="bg-primary/40 rounded-md p-1 text-white cursor-pointer"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
