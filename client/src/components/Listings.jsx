import React, { useEffect, useState } from "react";
import { categories } from "../assets/data";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "./Loader";
import ListingCard from "./ListingCard";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(
        selectedCategory !== "All"
          ? `${API_URL}/listing?category=${selectedCategory}`
          : `${API_URL}/listing`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <section id="listing" className="max-padd-container py-12">
      {/* Title */}
      <div className="text-center pb-16">
        <h6 className="text-sun-yellow font-bold uppercase">
          From Concept to Reality
        </h6>
        <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">
          Discover Our Newest Listings
        </h2>
      </div>
      {/* Categories Container */}
      <div className="hide-scrollbar flex gap-x-1 bg-cloud-white ring-1 ring-slate-400/5 shadow-sm rounded-full px-2 py-3 overflow-x-auto mb-16">
        {categories?.map((category) => (
          <div
            key={category.label}
            onClick={() => setSelectedCategory(category.label)}
            className={`flexCenter flex-col gap-2 p-2 rounded-xl cursor-pointer min-w-24 xl:min-w-32 transition-colors duration-300 ${
              category.label === selectedCategory
                ? "bg-secondary text-cloud-white"
                : "bg-cloud-white text-text"
            }`}
            style={{ flexShrink: 0 }}
          >
            <div
              className="text-primary rounded-full h-10 w-10 p-2 flexCenter text-lg"
              style={{ backgroundColor: `${category.color}` }}
            >
              {category.icon}
            </div>
            <p className="medium-14">{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              title,
              description,
              booking = false,
            }) => (
              <ListingCard
                key={_id}
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
                price={price}
                title={title}
                description={description}
                booking={booking}
              />
            )
          )}
        </div>
      )}
    </section>
  );
};

export default Listings;
