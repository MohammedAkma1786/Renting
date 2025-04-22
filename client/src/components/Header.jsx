import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/state";
import { FaSearch, FaUser } from "react-icons/fa";

const Header = ({ setShowLogin }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_API_URL; // Use import.meta.env for Vite

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const handleSearch = () => {
    if (search) {
      navigate(`/listing/search/${search}`);
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <header className="bg-muted text-cloud-white py-4 shadow-md">
      <div className="max-padd-container flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold">
          Renting<span className="text-primary">Easy</span>
        </Link>

        {/* Search Bar */}
        <div className="bg-cloud-white text-text ring-1 ring-slate-900/5 rounded-full p-2 px-4 w-44 sm:w-96 flex justify-between items-center gap-x-2 relative">
          <input
            type="text"
            placeholder="Search here.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none border-none w-full bg-cloud-white"
          />
          <button
            disabled={!search}
            className="absolute right-0 h-full w-10 rounded-full bg-secondary text-cloud-white flex items-center justify-center cursor-pointer"
            onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <div
            onClick={() => setDropdownMenu(!dropdownMenu)}
            className="cursor-pointer">
            {!user ? (
              <FaUser size={24} />
            ) : (
              <img
                src={`${API_URL}/${user.profileImagePath.replace("public", "")}`}
                alt="User Profile"
                height={47}
                width={47}
                className="rounded-full object-cover"
              />
            )}
          </div>

          {dropdownMenu && (
            <div className="absolute top-14 right-0 w-40 p-4 rounded-3xl bg-cloud-white text-text medium-14 flex flex-col gap-y-2 shadow-lg z-50">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="hover:text-primary transition-colors duration-300">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-primary transition-colors duration-300">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/create-listing"
                    className="hover:text-primary transition-colors duration-300">
                    Add a Property
                  </Link>
                  <Link
                    to={`/${user._id}/trips`}
                    className="hover:text-primary transition-colors duration-300">
                    Trip List
                  </Link>
                  <Link
                    to={`/${user._id}/wishlist`}
                    className="hover:text-primary transition-colors duration-300">
                    Wish List
                  </Link>
                  <Link
                    to={`/${user._id}/listing`}
                    className="hover:text-primary transition-colors duration-300">
                    Property List
                  </Link>
                  <Link
                    to={`/${user._id}/reservations`}
                    className="hover:text-primary transition-colors duration-300">
                    Reservation List
                  </Link>
                  <Link
                    onClick={handleLogout}
                    className="hover:text-primary transition-colors duration-300 cursor-pointer">
                    Logout
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
