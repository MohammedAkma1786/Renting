import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";

const Category = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const dispatch = useDispatch();

  const listings = useSelector((state) => state.listings);

  const API_URL = import.meta.env.VITE_API_URL; // Use import.meta.env for Vite

  const getFeedListings = async () => {
    try {
      const response = await fetch(`${API_URL}/listing?category=${category}`, {
        method: "GET",
      });
      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [category]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <section className="max-padd-container py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 capitalize">
          {category} Listings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings?.map(
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
                booking={booking}
              />
            )
          )}
        </div>
      </section>
    </>
  );
};

export default Category;
