import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList"; // Corrected the import path
import ReservationList from "./pages/ReservationList";
import Category from "./pages/Category";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="text-[#404040] bg-primary">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/listing/:listingId" element={<ListingDetails />} />
          <Route path="/listing/category/:category" element={<Category />} />
          <Route path="/listing/search/:search" element={<Search />} />
          <Route path="/:userId/trips" element={<TripList />} />
          <Route path="/:userId/wishlist" element={<WishList />} />
          <Route path="/:userId/listing" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
